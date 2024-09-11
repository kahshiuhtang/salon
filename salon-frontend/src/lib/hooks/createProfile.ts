import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
interface ProfileProps {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    comments: string;
    role: "ADMIN" | "USER" | "MOD";
    userId: string;
}
interface UseProfileReturn {
    createProfile: (profileProps: ProfileProps) => Promise<void>;
    editProfile: (
        userId: string,
        currUserId: string,
        profile: ProfileProps
    ) => Promise<void>;
}
export const useUserProfile = (): UseProfileReturn => {
    const createProfile = async (profileProps: ProfileProps) => {
        try {
            await setDoc(doc(firebaseDb, "users", profileProps.userId), {
                ...profileProps,
            });
        } catch (e) {
            console.log("createProfile(): " + e);
        }
    };

    const editProfile = async (
        userId: string,
        currUserId: string,
        profile: ProfileProps
    ) => {
        if (currUserId == "") throw new Error("No user logged in...");
        const userDoc = doc(firebaseDb, "users", currUserId);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()) {
            throw new Error("User does not exist");
        }
        const userRole = userSnapshot.data().role;
        if (userRole == "USER" && userId != currUserId) {
            throw new Error("Trying to edit user without correct permissions");
        }
        await setDoc(doc(firebaseDb, "users", userId), {
            user: userId,
            ...profile,
        });
    };

    return { createProfile, editProfile };
};
