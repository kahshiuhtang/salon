import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
interface VerifyUserProfileProps {
    userId: string;
}
interface VerifyUserProfileReturn {
    verifyUser: (appointmentProps: VerifyUserProfileProps) => Promise<boolean>;
}
export const useVerifyUserProfile = (): VerifyUserProfileReturn => {
    const verifyUser = async (appProps: VerifyUserProfileProps) => {
        if (!appProps || !appProps.userId) {
            throw new Error("arguments invalid");
        }
        const userId = appProps.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.exists();
    };
    return { verifyUser };
};
