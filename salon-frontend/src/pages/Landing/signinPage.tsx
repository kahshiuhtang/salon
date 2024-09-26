import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div className="flex flex-col">
            <UnlockedNavbar/>
            <div className="flex justify-center items-center min-h-screen">
                <SignIn path="/sign-in" forceRedirectUrl={"/home"}/>
            </div>
        </div>
    );
}
