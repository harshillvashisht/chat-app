import type { Chat } from "../types/chat";

type ChatHeaderProps = {
  selectedChat: Chat | null;
};

export default function ChatHeader({ selectedChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center border-b border-[#1f2530] bg-[#10141b] px-4.5 py-3">
      <div>
        <h2 className="text-[14px] font-medium text-[#e8e8e6]">
          {selectedChat?.otherUser.username ?? "Select a chat"}
        </h2>

        <p className="font-mono text-[11px] text-[#5a5e66]">
          {selectedChat ? "Conversation" : "No chat selected"}
        </p>
      </div>
    </header>
  );
}