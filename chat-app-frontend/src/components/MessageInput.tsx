export default function MessageInput() {
  return (
    <div className="border-t bg-white p-4">
      <form className="flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}