import ChatMessage from "@/pages/Messages/Chat/chatMessage";

interface ChatMessages {
    messageContent: string;
    senderId: string;
    date: string;
}

interface ChatBodyProps {
    messages: ChatMessages[];
    currentUser: string;
}

export default function ChatBody({ messages, currentUser }: ChatBodyProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((item) => (
                <ChatMessage
                    key={item.date}
                    senderId={item.senderId}
                    currentUserId={currentUser}
                    message={item.messageContent}
                    date={""}
                />
            ))}
        </div>
    );
}
