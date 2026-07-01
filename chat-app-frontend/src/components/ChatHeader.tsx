import type { Chat } from "../types/chat";

type ChatHeaderProps = {
  selectedChat: Chat | null;
};

export default function ChatHeader({ selectedChat }: ChatHeaderProps) {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">
          {selectedChat?.otherUser.username ?? "Select a chat"}
        </h2>

        <p className="text-sm text-gray-500">
          {selectedChat ? "Conversation" : "No chat selected"}
        </p>
      </div>

      <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
        Info
      </button>
    </header>
  );
}