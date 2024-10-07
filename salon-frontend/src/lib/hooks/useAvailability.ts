import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDocs,
    QuerySnapshot,
    Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { RepeatTypeWeek, RepeatTypeDay } from "@/lib/types/types";
import { Availability, FormattedAvailability } from "@/lib/types/types";
import { generateRRule } from "@/lib/utils";
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
        props: GetAvailabilityProps
    ): Promise<FormattedAvailability[]> => {
        if (!props || !props.userId) {
            throw new Error("Arguments invalid");
        }
        const availability: FormattedAvailability[] = [];
        const userId = props.userId;
        // Get the availability collection for the specific user
        const availabilityCollectionRef = collection(firebaseDb, `users/${userId}/availability`);
        const availabilitySnapshot: QuerySnapshot<DocumentData> = await getDocs(availabilityCollectionRef);

        // Check if the collection is empty
        if (availabilitySnapshot.empty) {
            console.log("No availability documents found");
            return availability; // Return empty array if no documents exist
        }

        // Iterate through each document in the snapshot
        availabilitySnapshot.forEach((doc) => {
            const data = doc.data() as Availability; // Cast to Availability type
            const appDateObject = new Date((data.date as unknown as Timestamp).seconds * 1000);
            const dateString = appDateObject.toISOString().split("T")[0];
            const startTimestring = `${dateString} ${data.startTime}`;
            const endTimestring = `${dateString} ${data.endTime}`;
            const startDateObject = new Date(startTimestring);
            const endDateObject = new Date(endTimestring);

            const durationInMillis = endDateObject.getTime() - startDateObject.getTime();

            const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
            const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));
            const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                        
            const rrule = generateRRule(data, startDateObject);
            const eventInput: FormattedAvailability = {
                id: doc.id, // Unique ID for the event
                title: startTimestring, // Event title
                duration: formattedDuration,
                rrule: rrule,
            };
            availability.push(eventInput);
        });
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
