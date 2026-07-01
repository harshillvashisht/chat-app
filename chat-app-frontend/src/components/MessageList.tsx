import type { Message } from "../types/chat";

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  // TODO: Replace with authenticated user from /auth/me
  const currentUserId = 1;

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-6">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
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
              <p>{message.content}</p>

              <p
                className={`mt-1 text-right text-xs ${
                  isOwnMessage
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {message.createdAt}
              </p>
            </div>
          </div>
        );
      })}

      {messages.length === 0 && (
        <div className="text-center text-gray-500">
          No messages yet.
        </div>
      )}
    </div>
  );
}