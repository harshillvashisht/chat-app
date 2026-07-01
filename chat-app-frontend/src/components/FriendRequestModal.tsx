import type { FriendRequest } from "../types/chat";

type FriendRequestModalProps = {
  pendingRequests: FriendRequest[];
  onClose: () => void;
  onAcceptRequest: (requestId: number) => Promise<void>;
  onDeclineRequest: (requestId: number) => Promise<void>;
};

export default function FriendRequestModal({
  pendingRequests,
  onClose,
  onAcceptRequest,
  onDeclineRequest,
}: FriendRequestModalProps) {

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-sm rounded-xl bg-white shadow-xl"
      >
        {/* Header */}

        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            Friend Requests
          </h2>
        </div>

        {/* Requests */}

        <div className="max-h-80 overflow-y-auto">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b px-5 py-4"
            >
              <div>
                <p className="font-medium">
                  {request.sender.username}
                </p>

                <p className="text-sm text-gray-500">
                  sent you a friend request
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onAcceptRequest(request.id)} className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700 transition">
                  Accept
                </button>

                <button onClick={() => onDeclineRequest(request.id)} className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition">
                  Decline
                </button>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending friend requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}