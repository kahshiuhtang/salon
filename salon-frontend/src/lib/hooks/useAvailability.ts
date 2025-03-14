import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDocs,
    QuerySnapshot,
    Timestamp,
    updateDoc,
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
interface UpdateAvailabilityProps {
    userId: string;
    availabilityId: string;
    availability: AvailabilityProp; // Replace with the appropriate type
}
interface UseAvailabilityReturn {
    getAvailability: (
        props: GetAvailabilityProps
    ) => Promise<FormattedAvailability[]>;
    getUnformattedAvailability: (
        props: GetAvailabilityProps
    ) => Promise<Availability[]>;
    addAvailability: (props: AddAvailabilityProps) => Promise<string>;
    deleteAvailability: (props: DeleteAvailability) => Promise<void>;
    updateAvailability: (props: UpdateAvailabilityProps) => Promise<boolean>;
}
export const useAvailability = (): UseAvailabilityReturn => {
    const updateAvailability = async (props: UpdateAvailabilityProps): Promise<boolean> => {
        try {
            if (!props || !props.availability || !props.userId || !props.availabilityId) {
                console.log("Invalid arguments passed");
                return false;
            }
            const docRef = doc(firebaseDb, `users/${props.userId}/availability`, props.availabilityId);
            await updateDoc(docRef, { ...props.availability,
                repeatTypeDaily: props.availability.repeatDaily,
                repeatTypeWeekly: props.availability.repeatWeekly,
             });
            return true;
        } catch (e) {
            console.error("Error updating availability: ", e);
        }
        return false;
    };

    const getAvailability = async (
        props: GetAvailabilityProps
    ): Promise<FormattedAvailability[]> => {
        if (!props || !props.userId) {
            throw new Error("Arguments invalid");
        }
        const availability: FormattedAvailability[] = [];
        const userId = props.userId;
        const availabilityCollectionRef = collection(firebaseDb, `users/${userId}/availability`);
        const availabilitySnapshot: QuerySnapshot<DocumentData> = await getDocs(availabilityCollectionRef);

        if (availabilitySnapshot.empty) {
            console.log("No availability documents found");
            return availability; 
        }

        availabilitySnapshot.forEach((doc) => {
            const data = doc.data() as Availability; 
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
            if(rrule == null){
                const startDate = new Date(startTimestring);
                const endDate = new Date(endTimestring);
                availability.push({
                    id: doc.id, 
                    title: ' Available ', 
                    start: startDate.toISOString(), 
                    end: endDate.toISOString(),    
                    allDay: false,
                  });
            }else{
                const eventInput: FormattedAvailability = {
                    id: doc.id, // Unique ID for the event
                    title: startTimestring, // Event title
                    duration: formattedDuration,
                    rrule: rrule,
                };
                availability.push(eventInput);
            }
        });
        return availability;
    };

    const getUnformattedAvailability = async (
        props: GetAvailabilityProps
    ): Promise<Availability[]> => {
        if (!props || !props.userId) {
            throw new Error("Arguments invalid");
        }
        const availability: Availability[] = [];
        const userId = props.userId;
        // Get the availability collection for the specific user
        const availabilityCollectionRef = collection(firebaseDb, `users/${userId}/availability`);
        const availabilitySnapshot: QuerySnapshot<DocumentData> = await getDocs(availabilityCollectionRef);

        if (availabilitySnapshot.empty) {
            console.log("No availability documents found");
            return availability; 
        }

        availabilitySnapshot.forEach((doc) => {
            const data = doc.data() as Availability;
            data.date = (data.date as unknown as Timestamp).toDate();
            data.id = doc.id;
            availability.push(data);
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
                { ...props.availability,
                    repeatTypeDaily: props.availability.repeatDaily, //TODO: fix this mismatch of names somewhere
                    repeatTypeWeekly: props.availability.repeatWeekly,
                 }
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
                doc(firebaseDb, `users/${props.userId}/availability`, props.availabilityId)
            );
            console.log("Availability successfully deleted!");
        } catch (e) {
            console.error("Error deleting availability: ", e);
        }
    };
    return { getAvailability, updateAvailability, getUnformattedAvailability, addAvailability, deleteAvailability };
};
