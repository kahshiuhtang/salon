import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonUser } from "@/lib/hooks/createProfile";
import { SalonRole } from "@/lib/types/types";

interface GetNameFromUserIdProps {
    userId: string;
}
interface GetNameFromUserIdReturn {
    firstName: string;
    lastName: string;
}

interface GetEmployeeFromUserIdProps {
    userId: string;
}
interface GetEmployeeFromUserIdReturn {
    firstName: string;
    lastName: string;
    role: SalonRole;
}

interface FetchAllUsersProps {
    userId: string;
}
interface FetchAllUsersReturn {
    users: SalonUser[];
}
export interface SalonEmployee {
    id: string;
    firstName: string;
    lastName: string;
    role: SalonRole;
}

interface GetUserInfoReturn {
    getNameFromId: (
        props: GetNameFromUserIdProps
    ) => Promise<GetNameFromUserIdReturn>;
    getEmployeeFromId: (
        props: GetEmployeeFromUserIdProps
    ) => Promise<GetEmployeeFromUserIdReturn>;
    fetchAllUsers: (props: FetchAllUsersProps) => Promise<FetchAllUsersReturn>;
}
export const useGetUserInfo = (): GetUserInfoReturn => {
    const getNameFromId = async (props: GetNameFromUserIdProps) => {
        if (!props || !props.userId) {
            throw new Error("arguments invalid");
        }
        const userId = props.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) throw new Error("user does not exist");
        const data = userSnapshot.data() as SalonUser;
        return { firstName: data.firstName, lastName: data.lastName };
    };
    const getEmployeeFromId = async (props: GetEmployeeFromUserIdProps) => {
        if (!props || !props.userId) {
            throw new Error("arguments invalid");
        }
        const userId = props.userId;
        const userDoc = doc(firebaseDb, "employees", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) throw new Error("user does not exist");
        const data = userSnapshot.data() as SalonUser;
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        };
    };
    const fetchAllUsers = async (props: FetchAllUsersProps) => {
        const documents: SalonUser[] = [];
        if (!props.userId) {
            console.log("no user signed in...");
        }
        const querySnapshot = await getDocs(collection(firebaseDb, "users"));
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data(),
            } as unknown as SalonUser);
        });
        return { users: documents };
    };
    return { getNameFromId, getEmployeeFromId, fetchAllUsers };
};
