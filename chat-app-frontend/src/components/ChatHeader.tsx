import type { Chat } from "../types/chat";

type ChatHeaderProps = {
  selectedChat: Chat | null;
};

export default function ChatHeader({ selectedChat }: ChatHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#2a2e37] px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-normal">
          {selectedChat?.otherUser.username ?? "Select a chat"}
        </h2>

        <p className="font-mono text-xs text-gray-500">
          {selectedChat ? "Conversation" : "No chat selected"}
        </p>
      </div>

      <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
        Info
      </button>
    </header>
  );
}