interface Chat {
  id: number;
  otherUser: {
    id: number;
    username: string;
  };
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastMessageEncryptedVersion: number | null;
  participant1Id: number;
  participant2Id: number;
  participant1LastReadMessageId: number | null;
  participant2LastReadMessageId: number | null;
  otherUserLastReadMessageId: number | null;
}

interface Message {
  id: number;
  clientMessageId: string;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  encryptedVersion: number | null;
}

export type MessageStatus = "sending" | "sent" | "failed";

export interface UIMessage extends Omit<Message, "id"> {
  id?: number; 
  status: MessageStatus;
  lastMessagePreview: string;
  attachments?: {
    objectKey: string;
    mimeType: string;
    fileName: string;
    fileSize: number;
    url: string;
  }[]
}

interface FriendRequest {
  id: number;
  sender: {
    id: number;
    username: string;
  };
}

export type User = {
    id: number;
    username: string;
    relationship: "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "FRIENDS";
};

export type { Chat , Message, FriendRequest,}