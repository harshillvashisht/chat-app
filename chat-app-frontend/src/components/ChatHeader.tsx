export default function ChatHeader() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="font-semibold text-lg">John Doe</h2>
        <p className="text-sm text-green-500">Online</p>
      </div>

      <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
        Info
      </button>
    </header>
  );
}