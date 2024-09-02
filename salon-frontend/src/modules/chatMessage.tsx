interface ChatMessageProps {
    message: string;
    senderId: string;
    currentUserId: string;
    date: string;
}

export default function ChatMessage({
    message,
    senderId,
    currentUserId,
}: ChatMessageProps) {
    return senderId === currentUserId ? (
        <div className="flex justify-end mb-4">
            <div className="bg-purple-200 rounded p-2">
                <p>{message}</p>
            </div>
            <div className="ml-2">
                <p>{date}</p>
            </div>
        </div>
    ) : (
        <div className="flex mb-4">
            <div className="mr-2">
                <p>{date}</p>
            </div>
            <div className="bg-blue-200 rounded p-2">
                <p>{message}</p>
            </div>
        </div>
    );
}
