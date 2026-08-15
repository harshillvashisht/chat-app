import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import type { Chat, Message, FriendRequest, User } from "../types/chat";
import { getChats }  from "../services/chatApi.ts";
import { getMessages, sendMessage } from "../services/messageApi.ts";
import { acceptRequest, declineRequest, getRequests } from "../services/friendRequestApi.ts";
import { socket } from "../socket/socket.ts";
import { getCurrentUser } from "../services/authApi.ts";
import type { UIMessage } from "../types/chat";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [messages, setMessages] = useState<UIMessage[]>([]);

    const [chats, setChats] = useState<Chat[]>([]);

    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

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

    const handleNewMessage = (newMessage: UIMessage) => {

        if (selectedChat && newMessage.chatId === selectedChat.id) {
               setMessages(prev =>
                upsertMessage(prev, {
                    ...newMessage,
                    status: "sent"
                })
                );
        }

        setChats((prevChats) => {
            const chatIndex = prevChats.findIndex(chat => chat.id === newMessage.chatId);

            if (chatIndex === -1) {
                return prevChats;
            }
            
            const updatedChats = [...prevChats];
            const [chat] = updatedChats.splice(chatIndex, 1);
            const updatedChat = { ...chat, lastMessage: newMessage.content, lastMessageAt: newMessage.createdAt };
            return [updatedChat, ...updatedChats];
              
        })
};



   useEffect(() => {

    const handleReconnect = () => {
        fetchChats();
        if (selectedChat) {
            fetchMessages();
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

    const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await getMessages(selectedChat.id);
                    setMessages(response.data.map((m: Message) => ({ ...m, status: "sent" as const })));
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

  return (
    <div className="h-screen bg-slate-100 flex">
      <Sidebar chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} pendingRequests={pendingRequests} onAcceptRequest={onAcceptRequest} onDeclineRequest={onDeclineRequest} />
      <ChatArea messages={messages} selectedChat={selectedChat} currentUser={currentUser}  onOptimisticMessage={handleOptimisticMessage} onMessageFailed={handleMessageFailed} onRetryMessage={handleRetryMessage} />
    </div>
  );
}