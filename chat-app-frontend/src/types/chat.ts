interface Chat {
  id: number;
  otherUser: {
    id: number;
    username: string;
  };
  lastMessage: string | null;
  lastMessageAt: string | null;
}

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

interface FriendRequest {
  id: number;
  sender: {
    id: number;
    username: string;
  };
}

export type { Chat , Message, FriendRequest }