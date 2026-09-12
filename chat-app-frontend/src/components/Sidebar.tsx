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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(timer);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await searchUsers(query);
      setSearchResults(response.data.data);
      console.log("Search results:", response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    fetchSearchResults(debouncedSearchQuery);

}, [debouncedSearchQuery]);

const isSearching = debouncedSearchQuery.trim() !== "";

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
    <aside className="relative flex w-70 flex-col border-r border-[#1f2530] bg-[#0d1117] p-3">
      <SearchUser searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />

      <div className="border-b border-[#1f2530] py-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-md bg-[#12332e] p-2 text-center font-medium text-[#2dd4bf] transition hover:bg-[#161b23]"
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