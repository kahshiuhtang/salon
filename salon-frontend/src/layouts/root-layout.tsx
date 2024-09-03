import { Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import LandingPage from "@/pages/landingPage";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
var PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
var SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

if (!SUPABASE_API_KEY) {
  SUPABASE_API_KEY = process.env.VITE_SUPABASE_API_KEY;
}
if (!SUPABASE_API_KEY) {
  throw new Error("Missing Supabase API Key");
}
export default function RootLayout() {
  const navigate = useNavigate();
  const supabase = createClient(
    "https://ijqfjbyqndnbcxlyxylf.supabase.co",
    SUPABASE_API_KEY
  );
  if (!supabase) {
    throw new Error("Unable to connect to supabase");
  }

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
              window.location.href.includes("sign-in") == false && (
                <LandingPage></LandingPage>
              )}
          </SignedOut>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
