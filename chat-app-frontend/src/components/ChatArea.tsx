import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Chat, Message } from "../types/chat";
import { useState } from "react";
import { sendMessage } from "../services/messageApi";

type ChatAreaProps = {
  messages: Message[];
  selectedChat: Chat | null;
};

export default function ChatArea({ messages, selectedChat }: ChatAreaProps) {

  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    const trimmedText = text.trim();
    
    if (trimmedText === "" || !selectedChat) return; 

    const response = await sendMessage(selectedChat.id, trimmedText);

    console.log(response);

    setText("");
 
  };  

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader selectedChat={selectedChat} />

      <MessageList messages={messages} />

      <MessageInput text={text} onChangeText={setText} onSend={handleSendMessage} />
    </main>
  );
}