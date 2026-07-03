import SearchUser from "./SearchUser";
import ChatList from "./ChatList";
import { useEffect, useState } from "react";
import FriendRequestModal from "./FriendRequestModal";
import type { Chat, FriendRequest, User } from "../types/chat";
import { searchUsers } from "../services/searchapi.ts";
import SearchResults from "./SearchResult.tsx";
import { sendFriendRequest } from "../services/friendRequestApi.ts";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const fetchSearchResults = async () => {
    try {
      const response = await searchUsers(searchQuery);
      setSearchResults(response.data.data);
      console.log("Search results:", response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    fetchSearchResults();

}, [searchQuery]);

const isSearching = searchQuery.trim() !== "";

const handleAddFriend = async (username: string) => {
    try {
        await sendFriendRequest(username);

        setSearchResults((prev) =>
            prev.map((user) =>
                user.username === username
                    ? { ...user, relationship: "PENDING_SENT" }
                    : user
            )
        );
    } catch (error) {
        console.error(error);
    }
};

  return (
    <aside className="relative w-80 bg-white border-r border-gray-200 flex flex-col">
      <SearchUser searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />

      <div className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          Friend Requests
        </button>
      </div>

      {isSearching ? (
    <SearchResults
        users={searchResults}
        onAddFriend={handleAddFriend}
    />
) : (
    <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={onSelectChat}
    />
)}

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