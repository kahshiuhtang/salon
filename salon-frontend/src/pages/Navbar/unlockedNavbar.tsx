import { Book, Home, Paintbrush, Phone, SquareMenu } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnlockedNavbar() {
  return (
    <nav className="bg-primary text-primary-foreground p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold flex items-center"
                >
                    <Paintbrush className="mr-2 h-6 w-6" />
                    S&S Nails
                </Link>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Home className="mr-1 h-4 w-4" />
                        Home
                    </Link>
                    <Link
                        to="/services"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <SquareMenu className="mr-1 h-4 w-4" />
                        Book
                    </Link>
                    <Link
                        to="/contact"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Phone className="mr-1 h-4 w-4" />
                        Contact
                    </Link>
                    <Link
                        to="/about"
                        className="flex items-center hover:text-primary-foreground/80"
                    >
                        <Book className="mr-1 h-4 w-4" />
                        About
                    </Link>
                </div>
            </div>
        </nav>
  );
}
