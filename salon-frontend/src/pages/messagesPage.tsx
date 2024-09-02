import Navbar from "@/modules/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatProfileTab from "@/modules/chatProfileTab";
import { useState } from "react";

export default function MessagesPage() {
    const [conversations, _] = useState<any[]>([]);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center mt-8">
                <Card className="w-1/5 bg-slate-300">
                    <CardHeader className="flex justify-center ">
                        <CardTitle className="flex justify-center ">
                            <h1 className="text-black">Messages</h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {conversations.map((conv) => (
                                <ChatProfileTab
                                    key={conv.id}
                                    username={conv.participants.join(", ")}
                                    lastMessage={conv.lastMessage}
                                    lastMessageTime={conv.lastMessageTimestamp
                                        .toDate()
                                        .toLocaleString()}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
