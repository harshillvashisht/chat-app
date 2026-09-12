import type { User } from "../types/chat";

type SearchResultsProps = {
    users: User[];
    onAddFriend: (username: string) => void;
};

export default function SearchResults({
    users,
    onAddFriend,
}: SearchResultsProps) {

    if (users.length === 0) {
        return (
            <div className="p-4 text-gray-500">
                No users found.
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {users.map((user) => {
                let buttonText = "Add Friend";
                let disabled = false;

                switch (user.relationship) {
                    case "NONE":
                        buttonText = "Add Friend";
                        break;

                    case "PENDING_SENT":
                        buttonText = "Pending";
                        disabled = true;
                        break;

                    case "PENDING_RECEIVED":
                        buttonText = "Check Requests";
                        disabled = true;
                        break;

                    case "FRIENDS":
                        buttonText = "Friends";
                        disabled = true;
                        break;
                }

                return (
                    <div
                        key={user.id}
                        className="flex items-center justify-between border-b p-4 text-amber-50"
                    >
                        <span>{user.username}</span>

                        <button
                            disabled={disabled}
                            onClick={() => onAddFriend(user.username)}
                            className={`rounded-lg py-2 px-4 text-white font-medium transition ${
                                disabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {buttonText}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}