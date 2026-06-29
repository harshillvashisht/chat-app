import { useEffect } from 'react';

export default function ChatPage() {

    useEffect(() => {
    console.log("Chat page mounted");
}, []);

    return (
        <div>
            <h1>Chat Page</h1>
        </div>
    );
}