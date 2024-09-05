import { Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import LandingPage from "@/pages/landingPage";
var PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
    PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}
if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}
export default function RootLayout() {
    const navigate = useNavigate();
    return (
        <ClerkProvider
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
            publishableKey={PUBLISHABLE_KEY}
            signUpFallbackRedirectUrl="/create-profile"
        >
            <header className="header">
                <div>
                    <SignedIn></SignedIn>
                    <SignedOut>
                        {window.location.href.includes("sign-up") == false &&
                            window.location.href.includes("sign-in") ==
                                false && <LandingPage></LandingPage>}
                    </SignedOut>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </ClerkProvider>
    );
}