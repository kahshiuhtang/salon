import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <>Loading...</>;
  }
  if (!user || !user["id"]) {
    return <>Error, no logged in user, please fresh and try again.</>;
  }
  var SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

  if (!SUPABASE_API_KEY) {
    SUPABASE_API_KEY = process.env.VITE_SUPABASE_API_KEY;
  }
  async function setUsersRoleInDB() {
    const supabase = createClient(
      "https://ijqfjbyqndnbcxlyxylf.supabase.co",
      SUPABASE_API_KEY
    );
    if (!supabase) {
      throw new Error("Unable to connect to supabase");
    }
    // const { error } = await supabase
    //   .from("users")
    //   .insert({ user_id: currentUserId, role: "ADMIN" });
    // if (error) {
    //   console.log(error);
    // }
  }

  setUsersRoleInDB();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">Salon</h2>
        <div className="space-x-4 flex">
          <Link to="/items">
            <p className="text-white hover:text-gray-300">Home</p>
          </Link>
          <Link to="/create">
            <p className="text-white hover:text-gray-300">Book</p>
          </Link>
          <Link to="/users">
            <p className="text-white hover:text-gray-300">Open Chat</p>
          </Link>

          <Link to="/messages">
            <p className="text-white hover:text-gray-300">Messages</p>
          </Link>
          <Link to="/settings">
            <p className="text-white hover:text-gray-300">Settings</p>
          </Link>
          <div>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
