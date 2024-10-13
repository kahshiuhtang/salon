import {
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  useEffect(() => {
    const fetchNotifications = async () => {
      // Replace this with actual API call
      const mockNotifications: SalonNotification[] = [
        { id: "1", title: "New Booking", description: "You have a new booking request", senderId: "user1", type: "booking", dateSent: new Date(), seen: false },
        { id: "2", title: "Appointment Reminder", description: "Your appointment is in 1 hour", senderId: "system", type: "reminder", dateSent: new Date(Date.now() - 1000 * 60 * 60), seen: false },
        { id: "3", title: "New User", description: "A new user has registered", senderId: "system", type: "user", dateSent: new Date(Date.now() - 1000 * 60 * 60 * 2), seen: true },
        { id: "4", title: "Booking Confirmed", description: "Your booking has been confirmed", senderId: "user2", type: "booking", dateSent: new Date(Date.now() - 1000 * 60 * 60 * 3), seen: true },
        { id: "5", title: "Payment Received", description: "Payment for your last appointment has been received", senderId: "system", type: "payment", dateSent: new Date(Date.now() - 1000 * 60 * 60 * 4), seen: true },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const unseenNotifications = notifications.filter(n => !n.seen);
  const notificationsToShow = unseenNotifications.length > 0 ? unseenNotifications : notifications.slice(0, 5);

  return (
    <DropdownMenu>
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
          <ScrollArea className="">
            {notificationsToShow.map((notification) => (
              <div key={notification.id} className="mb-2 p-2 rounded bg-secondary">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-sm">{notification.description}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{notification.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {notification.dateSent.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}