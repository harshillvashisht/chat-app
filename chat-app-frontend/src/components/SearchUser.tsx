type SearchUserProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchUser({ searchQuery, setSearchQuery }: SearchUserProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-4 border-b border-gray-200"
    >
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}