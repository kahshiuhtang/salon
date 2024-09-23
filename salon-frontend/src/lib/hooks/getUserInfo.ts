import { doc, getDoc } from "firebase/firestore";
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
    return { getNameFromId, getEmployeeFromId };
};
