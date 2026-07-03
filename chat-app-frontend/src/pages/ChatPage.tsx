import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import type { Chat, Message, FriendRequest, User } from "../types/chat";
import { getChats }  from "../services/chatApi.ts";
import { getMessages } from "../services/messageApi.ts";
import { acceptRequest, declineRequest, getRequests } from "../services/friendRequestApi.ts";
import { socket } from "../socket/socket.ts";
import { getCurrentUser } from "../services/authApi.ts";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);

    const [chats, setChats] = useState<Chat[]>([]);

    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

      const fetchCurrentUser = async () => {
          try {
                const user = await getCurrentUser();
                setCurrentUser(user);
          } catch (err) {
                console.error(err);
      }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const handleNewMessage = (newMessage: Message) => {

        if (selectedChat && newMessage.chatId === selectedChat.id) {
              setMessages((prev) => [...prev, newMessage]);
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

    socket.on("new_message", handleNewMessage);

    return () => {
        socket.off("new_message", handleNewMessage);
    };
}, [selectedChat]);

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

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await getMessages(selectedChat.id);
                    setMessages(response.data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
            else{
                return setMessages([]);
            }
        };

        fetchMessages();
    }, [selectedChat]);

  return (
    <div className="h-screen bg-slate-100 flex">
      <Sidebar chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} pendingRequests={pendingRequests} onAcceptRequest={onAcceptRequest} onDeclineRequest={onDeclineRequest} />
      <ChatArea messages={messages} selectedChat={selectedChat} currentUser={currentUser} />
    </div>
  );
}