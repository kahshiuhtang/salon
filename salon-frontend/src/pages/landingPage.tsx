import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="w-100 h-100 flex justify-center items-center min-h-screen">
      <Card className="w-1/4 ">
        <CardHeader>
          <CardTitle>Salon</CardTitle>
          <CardDescription>
            Enter your credentials to log in or sign up for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="mr-2">
              <Link
                className={buttonVariants({
                  variant: "outline",
                })}
                to="/sign-in"
              >
                <p>Sign In</p>
              </Link>
            </div>
            <div>
              <Link
                className={buttonVariants({
                  variant: "default",
                })}
                to="/sign-up"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
