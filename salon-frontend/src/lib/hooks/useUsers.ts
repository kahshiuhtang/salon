import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonRole, SalonUser } from "@/lib/types/types";

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
interface GetUserFromId {
    userId: string;
}
interface FetchAllUsersProps {
    userId: string;
}
interface FetchAllUsersReturn {
    users: SalonUser[];
}
interface FetchFromPhoneOrEmailProps {
    phoneNumber: string;
    email: string;
}
interface CreateClerkProfileProps {
    email: string[];
    phoneNumber: string[];
    password: string;
    firstName: string;
    lastName: string;
}
interface CreateClerkUserResponse {
    message: string;
    userId: string;
}

interface UseUserReturn {
    getUserFromId: (
        props: GetUserFromId
    ) => Promise<SalonUser | null>;
    getNameFromId: (
        props: GetNameFromUserIdProps
    ) => Promise<GetNameFromUserIdReturn>;
    getEmployeeFromId: (
        props: GetEmployeeFromUserIdProps
    ) => Promise<GetEmployeeFromUserIdReturn>;
    fetchAllUsers: (props: FetchAllUsersProps) => Promise<FetchAllUsersReturn>;
    fetchUserInfoFromEmailAndPhone: (
        props: FetchFromPhoneOrEmailProps
    ) => Promise<SalonUser[]>;
    getAllEmployees: () => Promise<SalonUser[]>;
    createClerkProfile: (
        props: CreateClerkProfileProps
    ) => Promise<CreateClerkUserResponse>;
}
export const useUsers = (): UseUserReturn => {
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
    const getUserFromId = async (props: GetNameFromUserIdProps) => {
        if(!props || !props.userId){
            return null;
        }
        const userId = props.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) throw new Error("user does not exist");
        const data = userSnapshot.data() as SalonUser;
        return data;
    }
    const createClerkProfile = async (props: CreateClerkProfileProps) => {
        var API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
        if (!API_GATEWAY) {
            API_GATEWAY = process.env.VITE_API_GATEWAY;
        }
        if (!props) return { message: "Props not set properly", userId: "" };
        try {
            const response = await fetch(API_GATEWAY, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: props.firstName,
                    lastName: props.lastName,
                    emailAddress: props.email, // Ensure this is an array if required
                    password: props.password,
                    phoneNumber: props.phoneNumber,
                }),
            });

            if (!response.ok) {
                console.error(
                    `Failed to create profile: ${response.statusText}`
                );
                return {
                    message:
                        "Error, unable to create new profile. Please refresh and try again.",
                    userId: "",
                };
            }
            const data = await response.json();
            const body = JSON.parse(data.body);
            return { message: "Success", userId: body.id };
        } catch (e) {
            console.log("createClerkProfile(): " + e);
        }
        return {
            message:
                "Error, unable to create new profile. Please refresh and try again.",
            userId: "",
        };
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
    const fetchUserInfoFromEmailAndPhone = async (
        props: FetchFromPhoneOrEmailProps
    ) => {
        const phoneQuery = query(
            collection(firebaseDb, "your-collection-name"),
            where("phoneNumber", "==", props.phoneNumber)
        );
        const emailQuery = query(
            collection(firebaseDb, "your-collection-name"),
            where("email", "==", props.email)
        );
        const [phoneSnapshot, emailSnapshot] = await Promise.all([
            getDocs(phoneQuery),
            getDocs(emailQuery),
        ]);
        const phoneResults = phoneSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                } as unknown as SalonUser)
        );
        const emailResults = emailSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                } as unknown as SalonUser)
        );
        const combinedResults = [...phoneResults, ...emailResults].filter(
            (doc, index, self) =>
                index === self.findIndex((d) => d.userId === doc.userId)
        );
        return combinedResults;
    };
    const getAllEmployees = async () => {
        const modQuery = query(
            collection(firebaseDb, "users"),
            where("role", "==", "MOD")
        );
        const adminQuery = query(
            collection(firebaseDb, "users"),
            where("role", "==", "ADMIN")
        );
        const [modSnapshot, adminSnapshot] = await Promise.all([
            getDocs(modQuery),
            getDocs(adminQuery),
        ]);
        const adminRes = adminSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                } as unknown as SalonUser)
        );
        const modRes = modSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                } as unknown as SalonUser)
        );
        const combinedResults = [...adminRes, ...modRes].filter(
            (doc, index, self) =>
                index === self.findIndex((d) => d.userId === doc.userId)
        );
        return combinedResults;
    };
    return {
        getNameFromId,
        getUserFromId,
        getEmployeeFromId,
        fetchAllUsers,
        fetchUserInfoFromEmailAndPhone,
        getAllEmployees,
        createClerkProfile,
    };
};
