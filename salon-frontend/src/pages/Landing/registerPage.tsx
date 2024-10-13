import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import { SignUp } from "@clerk/clerk-react";

export default function RegisterPage() {
    return (
        <div className="flex flex-col">
            <UnlockedNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <SignUp forceRedirectUrl={"/create-profile"} />
            </div>
        </div>
    );
}
