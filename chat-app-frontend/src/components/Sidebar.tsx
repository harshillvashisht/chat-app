import SearchUser from "./SearchUser";
import ChatList from "./ChatList";
import { useState } from "react";
import FriendRequestModal from "./FriendRequestModal";
import type { Chat, FriendRequest } from "../types/chat";

type SidebarProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  pendingRequests: FriendRequest[];
  onAcceptRequest: (requestId: number) => Promise<void>;
  onDeclineRequest: (requestId: number) => Promise<void>;
};

export default function Sidebar({
  chats,
  selectedChat,
  onSelectChat,
  pendingRequests,
  onAcceptRequest,
  onDeclineRequest,
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="relative w-80 bg-white border-r border-gray-200 flex flex-col">
      <SearchUser />

      <div className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Friend Requests
        </button>
      </div>

      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={onSelectChat}
      />

      {isModalOpen && (
        <FriendRequestModal
          pendingRequests={pendingRequests}
          onClose={() => setIsModalOpen(false)}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
        />
      )}
    </aside>
  );
}