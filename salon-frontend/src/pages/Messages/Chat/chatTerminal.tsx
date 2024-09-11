import { useState } from "react";

interface ChatTerminalProps {
    conversationId: string | undefined;
}

export default function ChatTerminal({ conversationId }: ChatTerminalProps) {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (conversationId) {
            conversationId = conversationId;
        }
    };

    return (
        <div className="w-full flex">
            <input
                type="text"
                placeholder="Enter a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
