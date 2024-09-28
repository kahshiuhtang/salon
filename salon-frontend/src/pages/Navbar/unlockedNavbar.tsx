import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Home, LogIn, Paintbrush, SquareMenu, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnlockedNavbar() {
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
            to="/services"
            className="flex items-center hover:text-primary-foreground/80"
          >
            <SquareMenu className="mr-1 h-4 w-4" />
            Services
          </Link>
          <Link
            to="/sign-in"
            className="flex items-center hover:text-primary-foreground/80"
          >
            <Button variant="outline">
              <LogIn />
              Login
            </Button>
          </Link>
          <Link
            to="/register"
            className="flex items-center hover:text-primary-foreground/80"
          >
            <Button variant="default">
              Register
              <UserPlus />
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
