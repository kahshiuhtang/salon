import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { RepeatTypeWeek, RepeatTypeDay } from "@/lib/types/types";
import { Availability, FormattedAvailability } from "@/lib/types/types";

interface GetAvailabilityProps {
    userId: string;
}

interface AddAvailabilityProps {
    userId: string;
    availability: AvailabilityProp;
}

interface DeleteAvailability {
    userId: string;
    availabilityId: string;
}
interface AvailabilityProp {
    date: Date;
    startTime: string;
    endTime: string;
    repeat: boolean;
    repeatWeekly: RepeatTypeWeek;
    repeatDaily: RepeatTypeDay;
}
interface UseAvailabilityReturn {
    getAvailability: (
        props: GetAvailabilityProps
    ) => Promise<FormattedAvailability[]>;
    addAvailability: (props: AddAvailabilityProps) => Promise<string>;
    deleteAvailability: (props: DeleteAvailability) => Promise<void>;
}
export const useAvailability = (): UseAvailabilityReturn => {
    const getAvailability = async (
        appProps: GetAvailabilityProps
    ): Promise<FormattedAvailability[]> => {
        if (!appProps || !appProps.userId) {
            throw new Error("Arguments invalid");
        }

        const userId = appProps.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            throw new Error("User does not exist");
        }

        const userRole = userSnapshot.data().role;
        const availability: FormattedAvailability[] = [];
        if (userRole === "USER") {
            const docRef = doc(firebaseDb, "availability", userId);
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                console.log("document doesnt exist");
                throw new Error("document for availability does not exist");
            }
            docSnapshot.data().forEach((doc: Availability) => {
                const appDateObject = new Date(
                    (doc.date as unknown as Timestamp).seconds * 1000
                );
                const dateString = appDateObject.toISOString().split("T")[0];
                const startTimestring = `${dateString} ${doc.startTime}`;
                const endTimestring = `${dateString} ${doc.endTime}`;
                const startDateObject = new Date(startTimestring);
                const endDateObject = new Date(endTimestring);
                availability.push({
                    id: doc.id,
                    start: startDateObject,
                    end: endDateObject,
                } as FormattedAvailability);
            });
        }
        return availability;
    };
    const addAvailability = async (
        props: AddAvailabilityProps
    ): Promise<string> => {
        try {
            if (!props || !props.availability || !props.userId) {
                console.log("Invalid arguments passed");
                return "";
            }
    
    
            const docRef = await addDoc(
                collection(firebaseDb, `users/${props.userId}/availability`),
                props.availability
            );
            return docRef.id;
        } catch (e) {
            console.error("Error adding multiple availabilities: ", e);
        }
        return "";
    };
    const deleteAvailability = async (
        props: DeleteAvailability
    ): Promise<void> => {
        try {
            if (!props || !props.availabilityId) {
                console.log("invalid arguments passed");
                return;
            }
            await deleteDoc(
                doc(firebaseDb, "availability", props.availabilityId)
            );
            console.log("Availability successfully deleted!");
        } catch (e) {
            console.error("Error deleting availability: ", e);
        }
    };
    return { getAvailability, addAvailability, deleteAvailability };
};
