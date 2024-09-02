import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatProfileTabProps {
    username: string;
    lastMessage: string;
    lastMessageTime: string;
}

export default function ChatProfileTab({
    username,
    lastMessage,
    lastMessageTime,
}: ChatProfileTabProps) {
    return (
        <div className="w-full flex justify-between px-4 py-2 border-b">
            <div className="flex items-center">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="pl-4">
                    <b>{username}</b>
                    <p>{lastMessage}</p>
                </div>
            </div>
            <div className="flex items-center">
                <p>{lastMessageTime}</p>
            </div>
        </div>
    );
}
