import {
    MenuSquareIcon,
    HomeIcon,
    CalendarCheck2,
    BadgeDollarSign,
    BookOpen,
    Users,
    StickyNoteIcon,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function Sidebar() {
    return (
        <div>
            <div className="space-y-4 py-4 w-48">
                <div className="px-4 py-2">
                    <h1 className="mb-2 px-2 text-xl font-semibold tracking-tight">
                        Control Panel
                    </h1>
                    <div className="space-y-1">
                        <NavLink to="/home">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <HomeIcon className="mr-2 h-4 w-4" />
                                Home
                            </Button>
                        </NavLink>
                        <NavLink to="/schedule">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <CalendarCheck2 className="mr-2 h-4 w-4" />
                                Schedule
                            </Button>
                        </NavLink>
                        <NavLink to="/transactions">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <BadgeDollarSign className="mr-2 h-4 w-4" />
                                Transactions
                            </Button>
                        </NavLink>
                        <NavLink to="/services">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <MenuSquareIcon className="mr-2 h-4 w-4" />
                                Services
                            </Button>
                        </NavLink>
                        <NavLink to="/clients">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Clients
                            </Button>
                        </NavLink>
                        <NavLink to="/staff">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Staff
                            </Button>
                        </NavLink>
                        <NavLink to="/inventory">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <StickyNoteIcon className="mr-2 h-4 w-4" />
                                Inventory
                            </Button>
                        </NavLink>
                        <NavLink to="/settings">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full mt-1 justify-start"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
