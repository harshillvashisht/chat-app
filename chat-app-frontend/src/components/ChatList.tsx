import type { Chat } from "../types/chat";


type ChatListProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
};

const formatMessageTime = (lastMessageAt: string) => {
    if(!lastMessageAt) return "";
    const date = new Date(lastMessageAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isToday) {
        return time;
    }

    const isThisYear = date.getFullYear() === now.getFullYear();
    const datePart = date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: isThisYear ? undefined : "numeric"
    });

    return `${datePart}, ${time}`;
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
          className={`cursor-pointer rounded-md border-l-2 px-2.5 py-2 transition hover:bg-[#161b23] ${
            selectedChat?.id === chat.id
              ? "border-l-2 border-l-[#2dd4bf] bg-[#161b23] rounded-[0_6px_6px_0]"
              : "border-l-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-[#e8e8e6]">
              {chat.otherUser.username}
            </h2>

            <span className="text-right text-[10px] font-mono text-[#5a5e66]">
              {formatMessageTime(chat.lastMessageAt ?? "") }
            </span>
          </div>

          <p className="truncate text-[12px] text-[#8b8f98]">
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