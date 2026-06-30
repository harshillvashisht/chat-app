type FriendRequestModalProps = {
  onClose: () => void;
};

const dummyRequests = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice" },
];

export default function FriendRequestModal({
  onClose,
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
          {dummyRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b px-5 py-4"
            >
              <div>
                <p className="font-medium">{request.name}</p>
                <p className="text-sm text-gray-500">
                  sent you a friend request
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700 transition">
                  Accept
                </button>

                <button className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition">
                  Decline
                </button>
              </div>
            </div>
          ))}

          {dummyRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending friend requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}