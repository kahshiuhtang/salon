import {
    doc,
    getDoc,
    Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { RepeatTypeWeek, RepeatTypeDay } from "@/lib/types/types";

interface GetAvailabilityProps {
    userId: string;
}
export interface Availability {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    repeat: boolean;
    repeatTypeWeekly?: RepeatTypeWeek;
    repeatTypeDaily?: RepeatTypeDay;
}
export interface FormattedAvailability {
    start: Date;
    end: Date;
}
interface UseGetAllAppointmentsReturn {
    getAvailability: (props: GetAvailabilityProps) => Promise<FormattedAvailability[]>;
}
export const useGetAllAppointments = (): UseGetAllAppointmentsReturn => {
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
    return { getAvailability };
};
