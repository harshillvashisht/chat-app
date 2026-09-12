import type {  UIMessage } from "../types/chat";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

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

function AttachmentView({
  attachment,
  onImageClick,
}: {
  attachment: { url: string; mimeType: string; fileName: string };
  onImageClick: (url: string) => void;
}) {
  if (attachment.mimeType.startsWith("image/")) {
    return (
      <img
        src={attachment.url}
        alt={attachment.fileName}
        onClick={() => onImageClick(attachment.url)}
        className="mb-2 max-h-55 max-w-55 cursor-pointer rounded-sm object-cover"
      />
    );
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
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

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
    <div className="flex-1 overflow-y-auto space-y-4 bg-[#10141b] p-6">
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
              className={`max-w-xs rounded-sm px-4 py-2 ${
                isOwnMessage
                  ? "border-l-2 border-teal-400 bg-[#1a3d3a] text-[#e6e6e6]"
                  : "bg-[#1c1f26] text-[#e6e6e6]"
              }`}
            >
              {message.attachments?.map((attachment, index) => (
                <AttachmentView
                  key={index}
                  attachment={attachment}
                  onImageClick={setLightboxImageUrl}
                />
              ))}
              <p>{message.content}</p>

              <div className="mt-1 flex items-center justify-end gap-1 font-mono text-[10px] text-[#5a5e66]">
                {message.encryptedVersion != null && (
                  <Lock size={11} className="text-[#2dd4bf]" />
                )}
                <p>
                  {formatMessageTime(message.createdAt)}
                </p>

              {message.status === "sent" && message.id === lastOwnMessageId && (
                  message.id === lastSeenOwnMessageId
                      ? <><span aria-hidden="true">·</span><span>Seen</span></>
                      : <><span aria-hidden="true">·</span><span>Sent</span></>
              )}
              </div>

              {message.status === "sending" && (
                <span>Sending...</span>
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

      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <img
            src={lightboxImageUrl}
            alt="Expanded attachment"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}