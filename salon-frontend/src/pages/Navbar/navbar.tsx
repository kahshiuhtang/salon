import { UserButton } from "@clerk/clerk-react";
import {
    BadgeDollarSign,
    Book,
    FileText,
    Home,
    Paintbrush,
    Settings,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import NotificationDropdown from "@/pages/Navbar/Notifications/notificationPopover";
import { useUserContext } from "@/contexts/userContext";
export default function Navbar() {
    const { role } = useUserContext();
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
                    {role === "USER" && (
                        <Link
                            to="/book"
                            className="flex items-center hover:text-primary-foreground/80"
                        >
                            <Book className="mr-1 h-4 w-4" />
                            Book
                        </Link>
                    )}
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
                        to="/transactions"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <BadgeDollarSign className="mr-1 h-4 w-4" />
                        Transactions
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
