import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import ItemCard, { ItemCardProps } from "@/item/itemCard";
import Navbar from "@/modules/navbar";

export function getCurrentDate(separator = ":") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${"-"}${date}`;
}

export default function ItemsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [items, _] = useState<ItemCardProps[]>([]);
  const { user } = useUser();
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    var SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

    if (!SUPABASE_API_KEY) {
      SUPABASE_API_KEY = process.env.VITE_SUPABASE_API_KEY;
    }
    if (!SUPABASE_API_KEY) {
      throw new Error("Missing Supabase API Key");
    }
    return createClient(
      "https://ijqfjbyqndnbcxlyxylf.supabase.co",
      SUPABASE_API_KEY,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();
  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      setLoading(true);
      const { data, error } = await client.from("tasks").select();
      if (!error) setTasks(data);
      setLoading(false);
    }

    loadTasks();
  }, [user]);

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Insert task into the "tasks" database
    await client.from("tasks").insert({
      name,
    });
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Tasks</h1>

        {loading && <p>Loading...</p>}

        {!loading &&
          tasks.length > 0 &&
          tasks.map((task: any) => <p>{task.name}</p>)}

        {!loading && tasks.length === 0 && <p>No tasks found</p>}

        <form onSubmit={createTask}>
          <input
            autoFocus
            type="text"
            name="name"
            placeholder="Enter new task"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid gap-2 grid-cols-3 p-4">
          {items.map((item, index) => (
            <ItemCard
              key={index}
              title={item.title}
              description={item.description}
              images={item.images}
              price={item.price}
              createdAt={item.createdAt}
              location={item.location}
              college={item.college}
              username={item.username}
              userId={item.userId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
