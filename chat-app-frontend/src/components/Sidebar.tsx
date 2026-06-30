import SearchUser from "./SearchUser";
import ChatList from "./ChatList";
import { useState } from "react";
import FriendRequestModal from "./FriendRequestModal";



export default function Sidebar() {
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

      <ChatList />

      {isModalOpen && (
        <FriendRequestModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </aside>
  );
}