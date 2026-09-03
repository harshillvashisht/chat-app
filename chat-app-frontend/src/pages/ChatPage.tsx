import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import type { Chat, Message, FriendRequest, User } from "../types/chat";
import { getChats, markChatRead, getChatPublicKey }  from "../services/chatApi.ts";
import { getMessages, sendMessage } from "../services/messageApi.ts";
import { acceptRequest, declineRequest, getRequests } from "../services/friendRequestApi.ts";
import { socket } from "../socket/socket.ts";
import { getCurrentUser } from "../services/authApi.ts";
import type { UIMessage } from "../types/chat";
import { base64ToBuffer, ensureKeyPairExists, getStoredPrivateKey, deriveAesKeyViaHkdf } from "../lib/crypto/keys.ts";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [messages, setMessages] = useState<UIMessage[]>([]);

    const [chats, setChats] = useState<Chat[]>([]);

    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const messagesRef = useRef<UIMessage[]>([]);

    const chatKeysRef = useRef<Map<number, CryptoKey>>(new Map());

    useEffect(() => {
        if(currentUser?.id) {
            ensureKeyPairExists(currentUser.id);
        }
    }, [currentUser?.id]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        if(!selectedChat) return;
        if(chatKeysRef.current.has(selectedChat.id)) return;

        let cancelled = false;

        const deriveSharedKey = async () => {
            if(!currentUser) return;
            const { publicKey: otherPublicKeyRaw } = await getChatPublicKey( selectedChat.id);

            if(!otherPublicKeyRaw) {
                return;
            }

            const myprivateKey = await getStoredPrivateKey(currentUser.id);

            const otherPublicKey = await crypto.subtle.importKey(
                "raw", base64ToBuffer(otherPublicKeyRaw), "X25519", false, []
            );

            if(!myprivateKey) {
                console.error("Private key not found for current user.");
                return;
            }

            const sharedSecret = await crypto.subtle.deriveBits(
                { name: "X25519", public: otherPublicKey },
                myprivateKey,
                256
            );

            const aeskey = await deriveAesKeyViaHkdf(sharedSecret);

            if(!cancelled) {
                chatKeysRef.current.set(selectedChat.id, aeskey);
            }
            
        };

        deriveSharedKey();

        return () => {
            cancelled = true;
        };
    }, [selectedChat?.id, currentUser]);

    const upsertMessage = (
        prev: UIMessage[],
        incoming: UIMessage
    ): UIMessage[] => {
        const index = prev.findIndex(
            message => message.clientMessageId === incoming.clientMessageId
        );

        if (index === -1) {
            return [...prev, incoming];
        }

        const updated = [...prev];
        updated[index] = {
            ...prev[index],
            ...incoming
        };

        return updated.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    };

    const handleOptimisticMessage = (message: UIMessage) => {
        setMessages(prev => upsertMessage(prev, message));
    };

      const fetchCurrentUser = async () => {
          try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                if (!socket.connected) {
                    socket.connect();
              }
          } catch (err) {
                console.error(err);
      }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const handleMessageFailed = (clientMessageId: string) => {
        setMessages(prev =>
            prev.map(message =>
                message.clientMessageId === clientMessageId
                    ? { ...message, status: "failed" as const }
                    : message
            )
        );
    };

    useEffect(() => {
        const handleChatRead = ({ chatId, userId, lastReadMessageId }:
            { chatId: number; userId: number; lastReadMessageId: number }) => {
            if (currentUser && userId === currentUser.id) return; // ignore our own read event

            setChats(prev => prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, otherUserLastReadMessageId: lastReadMessageId }
                    : chat
            ));
        };

        socket.on("chat_read", handleChatRead);
        return () => { socket.off("chat_read", handleChatRead); };
    }, [currentUser]);

    const handleNewMessage = (newMessage: UIMessage) => {

        if (selectedChat && newMessage.chatId === selectedChat.id) {
               setMessages(prev =>
                upsertMessage(prev, {
                    ...newMessage,
                    status: "sent"
                })
                );
                markAsRead(selectedChat.id);
        }

        setChats((prevChats) => {
            const chatIndex = prevChats.findIndex(chat => chat.id === newMessage.chatId);

            if (chatIndex === -1) {
                return prevChats;
            }
            
            const updatedChats = [...prevChats];
            const [chat] = updatedChats.splice(chatIndex, 1);
            const updatedChat = { ...chat, lastMessage: newMessage.lastMessagePreview, lastMessageAt: newMessage.createdAt };
            return [updatedChat, ...updatedChats];
              
        })
};



   useEffect(() => {

    const handleReconnect = () => {
        fetchChats();
        if (selectedChat) {
            const currentMessages = messagesRef.current;
            const lastId = currentMessages.length > 0 ? currentMessages[currentMessages.length - 1].id : undefined;
            fetchMessages(lastId);
        }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("connect", handleReconnect);

    return () => {
        socket.off("new_message", handleNewMessage);
        socket.off("connect", handleReconnect);
    };
}, [selectedChat]);

    const handleRetryMessage = async (message: UIMessage) => {
        setMessages(prev =>
            prev.map(m =>
                m.clientMessageId === message.clientMessageId
                    ? { ...m, status: "sending" as const }
                    : m
            )
        );

        try {
            await sendMessage(
                message.chatId,
                message.content,
                message.clientMessageId
            );
        }
        catch (error) {
            handleMessageFailed(message.clientMessageId);
        }
    };

    const onAcceptRequest = async (requestId: number) => {
      try{
        await acceptRequest(requestId);
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );

        await fetchChats();
    }
      catch(error){
        console.error("Error accepting friend request:", error);
      }
    }

    const onDeclineRequest = async (requestId: number) => {
      try {
        await declineRequest(requestId);
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      } catch (error) {
        console.error("Error declining friend request:", error);
      }
    }

    const fetchChats = async () => {
            try { 
                  const response = await getChats();
                  setChats(response.data);
            }
            catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

    useEffect(() => {

        fetchChats();
    }, []);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
              const response = await getRequests();
              setPendingRequests(response.data);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
            }
        };

        fetchPendingRequests();
    }, []);

    const fetchMessages = async (after?: number) => {
            if (selectedChat) {
                try {
                    const response = await getMessages(selectedChat.id, after );
                    setMessages(prev => {
                        const incoming = response.data.map((m: Message) => ({ ...m, status: "sent" as const }));
                        if (!after) return incoming; 
                        return incoming.reduce((acc: UIMessage[], msg: UIMessage) => upsertMessage(acc, msg), prev); 
                    });
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
            else{
                return setMessages([]);
            }
        };

    useEffect(() => {

        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (selectedChat) {
            markAsRead(selectedChat.id);
        }
    }, [selectedChat]);

    const markAsRead = async (chatId: number) => {
    try {
        await markChatRead(chatId);
    } catch (error) {
        console.error("Error marking chat as read:", error);
    }
};


    const liveSelectedChat = chats.find(c => c.id === selectedChat?.id);

  return (
    <div className="h-screen bg-slate-100 flex">
      <Sidebar chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} pendingRequests={pendingRequests} onAcceptRequest={onAcceptRequest} onDeclineRequest={onDeclineRequest} />
      <ChatArea messages={messages} selectedChat={selectedChat} currentUser={currentUser}  otherLastReadMessageId={liveSelectedChat?.otherUserLastReadMessageId ?? null} onOptimisticMessage={handleOptimisticMessage} onMessageFailed={handleMessageFailed} onRetryMessage={handleRetryMessage} />
    </div>
  );
}