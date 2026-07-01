import { useState} from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import type { Chat , Message, FriendRequest } from "../types/chat";
import { useEffect } from "react";
import { getChats }  from "../services/chatApi.ts";
import { getMessages } from "../services/messageApi.ts";
import { acceptRequest, declineRequest, getRequests } from "../services/friendRequestApi.ts";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);

    const [chats, setChats] = useState<Chat[]>([]);

    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

    const onAcceptRequest = async (requestId: number) => {
      try{
        await acceptRequest(requestId);
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
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

    useEffect(() => {
        const fetchChats = async () => {
            try { 
                  const response = await getChats();
                  setChats(response.data);
            }
            catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

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
      <ChatArea messages={messages} selectedChat={selectedChat} />
    </div>
  );
}