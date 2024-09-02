import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function App() {
    return (
        <div className="flex justify-center ">
            <SignedOut>
                <SignIn />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );
}
