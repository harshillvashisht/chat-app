import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Chat, UIMessage } from "../types/chat";
import { useState } from "react";
import { sendMessage } from "../services/messageApi";

type ChatAreaProps = {
  messages: UIMessage[];
  selectedChat: Chat | null;
  currentUser: { id: number; username: string } | null;
  onOptimisticMessage: (message: UIMessage) => void;
  onMessageFailed: (clientMessageId: string) => void;
  onRetryMessage: (message: UIMessage) => void;
};

export default function ChatArea({ messages, selectedChat, currentUser, onOptimisticMessage , onMessageFailed, onRetryMessage }: ChatAreaProps) {

  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    const trimmedText = text.trim();
    
    if (trimmedText === "" || !selectedChat || !currentUser) return; 

    const clientMessageId = crypto.randomUUID();

    const optimisticMessage: UIMessage = {
          clientMessageId,
          chatId: selectedChat.id,
          senderId: currentUser.id,
          content: trimmedText,
          createdAt: new Date().toISOString(),
          status: "sending"
  };

    onOptimisticMessage(optimisticMessage);

    setText("");

     try {
        await sendMessage(
            selectedChat.id,
            trimmedText,
            clientMessageId
        );
    } catch (error) {
        onMessageFailed(clientMessageId);
        console.error(error);
    }
 
  };  

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader selectedChat={selectedChat} />

      <MessageList messages={messages} currentUser={currentUser} onRetryMessage={onRetryMessage} />

      <MessageInput text={text} onChangeText={setText} onSend={handleSendMessage} />
    </main>
  );
}