import { UserButton, useUser } from "@clerk/clerk-react";
import {
    Book,
    FileText,
    Home,
    Paintbrush,
    Settings,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import NotificationDropdown from "@/pages/Navbar/Notifications/notificationPopover";
import { SalonRole } from "@/lib/types/types";
import { useEffect, useState } from "react";
import { useRole } from "@/lib/hooks/useRole";
export default function Navbar() {
    const { user } = useUser();
    const [role, setRole] = useState<SalonRole>("USER");
    const { getRole } = useRole();
    const fetchUserRole = async function () {
        const userId = user?.id || "";
        if (userId == "") return;
        const userRole = await getRole({ userId });
        setRole(userRole);
    };
    useEffect(() => {
        fetchUserRole();
    }, [user]);
    return (
        <nav className="bg-primary text-primary-foreground p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center">
                    <Paintbrush className="mr-2 h-6 w-6" />
                    SNS Nails
                </Link>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/home"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Home className="mr-1 h-4 w-4" />
                        Home
                    </Link>
                    <Link
                        to="/book"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Book className="mr-1 h-4 w-4" />
                        Book
                    </Link>
                    {role !== "USER" && (
                        <Link
                            to="/users"
                            className="flex items-center hover:text-primary-foreground/80"
                        >
                            <Users className="mr-1 h-4 w-4" />
                            Users
                        </Link>
                    )}
                    <Link
                        to="/requests"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <FileText className="mr-1 h-4 w-4" />
                        Requests
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Settings className="mr-1 h-4 w-4" />
                        Settings
                    </Link>
                    <NotificationDropdown />
                    <UserButton />
                </div>
            </div>
        </nav>
    );
}
