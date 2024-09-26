import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonRole } from "@/lib/types/types";
interface GetRoleProps {
    userId: string;
}
interface UseRoleReturn {
    getRole: (props: GetRoleProps) => Promise<SalonRole>;
}
export const useRole = (): UseRoleReturn => {
    const getRole = async (props: GetRoleProps) => {
        if (!props || !props.userId) {
            throw new Error("arguments invalid");
        }
        const userId = props.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) throw new Error("use does not exist");
        return userSnapshot.data().role as SalonRole;
    };
    return { getRole };
};
