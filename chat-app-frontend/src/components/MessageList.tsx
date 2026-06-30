export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">

      <div className="flex justify-start">
        <div className="bg-white rounded-xl px-4 py-2 shadow max-w-xs">
          Hello 👋
        </div>
      </div>

      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-xl px-4 py-2 shadow max-w-xs">
          Hi! What's up?
        </div>
      </div>

      <div className="flex justify-start">
        <div className="bg-white rounded-xl px-4 py-2 shadow max-w-xs">
          Just testing our chat app 😄
        </div>
      </div>

    </div>
  );
}