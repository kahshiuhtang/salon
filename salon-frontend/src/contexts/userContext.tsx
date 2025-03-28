import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";
import { useRole } from "@/lib/hooks/useRole";
import { SalonRole } from "@/lib/types/types";

interface UserContextType {
  user: UserResource | null | undefined;
  role: SalonRole | undefined;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { getRole } = useRole();
  const [role, setRole] = useState<SalonRole | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserRole = async function () {
    try {
      const userId = user?.id || "";
      if (userId === "") {
        setLoading(false);
        return;
      }
      const userRole = await getRole({ userId });
      setRole(userRole);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;