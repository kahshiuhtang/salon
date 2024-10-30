import { Bell, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "@/lib/hooks/useNotification";
import { useUser } from "@clerk/clerk-react";
import { Timestamp } from "firebase/firestore";

export interface SalonNotification {
    id: string;
    title: string;
    description: string;
    senderId: string;
    type: string;
    dateSent: Date;
    seen: boolean;
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<SalonNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [updatedSeen, setUpdatedSeen] = useState(false);
    const { getNotifications, setNotifToSeen } = useNotification();
    const { user } = useUser();
    const userId = user?.id || "";

    useEffect(() => {
        const fetchNotifications = async () => {
            const notifs = await getNotifications({ userId });
            setNotifications(notifs);
        };

        fetchNotifications();
    }, [user]);
    const unseenNotifications = notifications.filter((n) => !n.seen);
    const notificationsToShow =
        unseenNotifications.length > 0
            ? unseenNotifications
            : notifications.slice(0, 5);
    const setViewed = async function () {
        try {
            const notifIds: string[] = unseenNotifications
                .filter((notification) => !notification.seen)
                .map((notification) => notification.id);
            await setNotifToSeen({ userId: userId, notifIds: notifIds });
            setUpdatedSeen(true);
        } catch (e) {
            console.log("setViewed(): " + e);
        }
    };

    useEffect(() => {
        if (isOpen && !updatedSeen) {
            setViewed();
        }
    }, [isOpen]);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unseenNotifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <div className="p-4">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <ScrollArea className="h-[300px]">
                        {notificationsToShow.length > 0 ? (
                            notificationsToShow.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="mb-2 p-2 rounded bg-secondary"
                                >
                                    <h4 className="text-sm font-medium">
                                        {notification.title}
                                    </h4>
                                    <p className="text-sm">
                                        {notification.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {notification.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {(
                                                notification.dateSent as any as Timestamp
                                            )
                                                .toDate()
                                                .toLocaleString("en-US", {
                                                    weekday: "long",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false, // 24-hour format
                                                })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                                <h4 className="text-lg font-semibold text-green-600">
                                    All up to date!
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    You have no new notifications at the moment.
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
