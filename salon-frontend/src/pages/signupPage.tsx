import UnlockedNavbar from "@/modules/unlockedNavbar";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div className="flex flex-col">
            <UnlockedNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <SignUp path="/sign-up" forceRedirectUrl={"/create-profile"} />
            </div>
        </div>
    );
}
