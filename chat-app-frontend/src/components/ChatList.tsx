export default function ChatList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 hover:bg-gray-100 cursor-pointer border-b">
        <h2 className="font-semibold">John Doe</h2>
        <p className="text-sm text-gray-500 truncate">
          Hey! Are you coming today?
        </p>
      </div>

      <div className="p-4 hover:bg-gray-100 cursor-pointer border-b">
        <h2 className="font-semibold">Alice</h2>
        <p className="text-sm text-gray-500 truncate">
          See you tomorrow.
        </p>
      </div>
    </div>
  );
}