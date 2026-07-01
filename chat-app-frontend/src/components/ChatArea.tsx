import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Chat, Message } from "../types/chat";

type ChatAreaProps = {
  messages: Message[];
  selectedChat: Chat | null;
};

export default function ChatArea({ messages, selectedChat }: ChatAreaProps) {
  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader selectedChat={selectedChat} />

      <MessageList messages={messages} />

      <MessageInput />
    </main>
  );
}