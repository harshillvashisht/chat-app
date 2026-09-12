type SearchUserProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchUser({ searchQuery, setSearchQuery }: SearchUserProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="border-b border-[#1f2530] pb-3"
    >
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-md border border-[#1f2530] bg-[#161b23] px-2.5 py-2 text-[#e8e8e6] placeholder:text-[#5a5e66] outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}