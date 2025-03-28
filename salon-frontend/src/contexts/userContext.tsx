import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";
import { useRole } from "@/lib/hooks/useRole";
import { SalonRole } from "@/lib/types/types";
import { useUsers } from "@/lib/hooks/useUsers";

interface UserContextType {
  user: UserResource | null | undefined;
  role: SalonRole | undefined;
  firstName: string;
  lastName: string;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { getNameFromId } = useUsers();
  const { getRole } = useRole();
  const [role, setRole] = useState<SalonRole | undefined>(undefined);
  const [firstName, setFirstname] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");
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
      const nameInfo = await getNameFromId({ userId });
      setFirstname(nameInfo.firstName);
      setLastname(nameInfo.lastName);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, role, loading, firstName, lastName }}>
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