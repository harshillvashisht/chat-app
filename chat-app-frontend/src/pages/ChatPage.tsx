import { useState} from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);

    const [messages, setMessages] = useState([]);

    const [chats, setChats] = useState([]);

    const [pendingRequests, setPendingRequests] = useState([]);

  return (
    <div className="h-screen bg-slate-100 flex">
      <Sidebar />
      <ChatArea />
    </div>
  );
}