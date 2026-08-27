import type {  UIMessage } from "../types/chat";
import { useEffect, useRef } from "react";

type MessageListProps = {
  messages: UIMessage[];
  currentUser: { id: number; username: string } | null;
  onRetryMessage: (message: UIMessage) => void;
  otherLastReadMessageId: number | null;
};

const formatMessageTime = (createdAt: string) => {
    const date = new Date(createdAt);
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

function AttachmentView({ attachment }: { attachment: { url: string; mimeType: string; fileName: string } }) {
  if (attachment.mimeType.startsWith("image/")) {
    return <img src={attachment.url} alt={attachment.fileName} className="rounded-lg max-w-full mb-2" />;
  }
  if (attachment.mimeType.startsWith("audio/")) {
    return <audio src={attachment.url} controls className="mb-2" />;
  }
  return (
    <a href={attachment.url} target="_blank" rel="noreferrer" className="block underline mb-2">
      📄 {attachment.fileName}
    </a>
  );
}

export default function MessageList({ messages, currentUser, onRetryMessage, otherLastReadMessageId }: MessageListProps) {

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
        behavior: "smooth",
    });
}, [messages]);

  let lastSeenOwnMessageId: number | null = null;
  if (otherLastReadMessageId != null) {
      for (const m of messages) {
          if (m.senderId === currentUser?.id && m.id != null && m.id <= otherLastReadMessageId) {
              lastSeenOwnMessageId = m.id;
          }
      }
  }

  let lastOwnMessageId: number | null = null;
  for (const m of messages) {                    // <-- ADD this loop
    if (m.senderId === currentUser?.id && m.id != null) {
        lastOwnMessageId = m.id;
    }
}

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-6">
      {messages.map((message) => {
        const isOwnMessage = currentUser && message.senderId === currentUser.id;

        return (
          <div
            key={message.clientMessageId}
            className={`flex ${
              isOwnMessage ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-xl px-4 py-2 shadow ${
                isOwnMessage
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {message.attachments?.map((attachment, index) => (
                <AttachmentView key={index} attachment={attachment} />
              ))}
              <p>{message.content}</p>

              <p
                className={`mt-1 text-right text-xs ${
                  isOwnMessage
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </p>

              {message.status === "sending" && (
                <span>Sending...</span>
              )}

              {message.status === "sent" && message.id === lastOwnMessageId && (
                  message.id === lastSeenOwnMessageId
                      ? <span>Seen</span>
                      : <span>Sent</span>
              )}

              {message.status === "failed" && (
                <div>
                  <span>Failed</span>
                  <button
                    onClick={() => onRetryMessage(message)} >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {messages.length === 0 && (
        <div className="text-center text-gray-500">
          No messages yet.
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}