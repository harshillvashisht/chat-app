import type { Chat } from "../types/chat";

type ChatListProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
};

export default function ChatList({
  chats,
  selectedChat,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`cursor-pointer border-b p-4 transition hover:bg-gray-100 ${
            selectedChat?.id === chat.id ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {chat.otherUser.username}
            </h2>

            <span className="text-xs text-gray-500">
              {chat.lastMessageAt ?? ""}
            </span>
          </div>

          <p className="truncate text-sm text-gray-500">
            {chat.lastMessage ?? "No messages yet"}
          </p>
        </div>
      ))}

      {chats.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No chats yet.
        </div>
      )}
    </div>
  );
}