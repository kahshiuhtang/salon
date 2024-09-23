import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonUser } from "@/lib/hooks/createProfile";
interface GetNameFromUserIdProps {
    userId: string;
}
interface GetNameFromUserIdReturn {
    firstName: string;
    lastName: string;
}
interface GetUserInfoReturn {
    getNameFromId: (
        props: GetNameFromUserIdProps
    ) => Promise<GetNameFromUserIdReturn>;
}
export const useGetUserInfo = (): GetUserInfoReturn => {
    const getNameFromId = async (props: GetNameFromUserIdProps) => {
        if (!props || !props.userId) {
            throw new Error("arguments invalid");
        }
        const userId = props.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) throw new Error("use does not exist");
        const data = userSnapshot.data() as SalonUser;
        return { firstName: data.firstName, lastName: data.lastName };
    };
    return { getNameFromId };
};
