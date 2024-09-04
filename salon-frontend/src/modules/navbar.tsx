import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h2 className="text-white text-2xl font-bold">Salon</h2>
                <div className="space-x-4 flex">
                    <Link to="/calendar">
                        <p className="text-white hover:text-gray-300">Home</p>
                    </Link>
                    <Link to="/book">
                        <p className="text-white hover:text-gray-300">Book</p>
                    </Link>
                    <Link to="/messages">
                        <p className="text-white hover:text-gray-300">
                            Messages
                        </p>
                    </Link>
                    <Link to="/settings">
                        <p className="text-white hover:text-gray-300">
                            Settings
                        </p>
                    </Link>
                    <div>
                        <UserButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
