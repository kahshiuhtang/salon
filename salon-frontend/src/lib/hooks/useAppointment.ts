import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
interface GetAllAppointmentsProps {
    userId: string;
}
interface UpdateAppointmentStatusProps {
    id: string;
    newStatus: AppointmentState;
}
export type AppointmentState =
    | "REQUESTED"
    | "COUNTERED-SALON"
    | "COUNTERED-USER"
    | "CONFIRMED"
    | "MISSED"
    | "RESCHEDULED"
    | "MODIFIED-USER"
    | "MODIFIED-SALON"
    | "FINISHED";
export interface Appointment {
    id: string;
    time: Date;
    length: Date;
    date: Date;
    service1: string;
    tech1: string;
    service2: string;
    tech2: string;
    service3: string;
    tech3: string;
    service4: string;
    tech4: string;
    state: AppointmentState;
    ownerId: string;
}
interface AddAppointmentProps {
    date: Date;
    time: string;
    service1: string;
    tech1: string;
    service2?: string;
    tech2?: string;
    service3?: string;
    tech3?: string;
    service4?: string;
    tech4?: string;
    state: AppointmentState;
    ownerId: string;
}
export interface FullCalendarAppointment {
    id: string;
    title: string;
    start: string | Date; //  (required)
    end?: string | Date; //  (optional)
    allDay?: boolean; //  (optional)
    backgroundColor?: string; //  (optional)
}
interface UseAppointmentReturn {
    addAppointment: (appointmentProps: AddAppointmentProps) => Promise<void>;
    getAppointments: (
        appointmentProps: GetAllAppointmentsProps
    ) => Promise<Appointment[]>;
    formatAppointments: (
        appointments: Appointment[]
    ) => FullCalendarAppointment[];
    updateAppointmentStatus: (
        statusProps: UpdateAppointmentStatusProps
    ) => Promise<void>;
}
export const useAppointment = (): UseAppointmentReturn => {
    const appCollectionRef = collection(firebaseDb, "appointments");
    const addAppointment = async (appointmentProps: AddAppointmentProps) => {
        await addDoc(appCollectionRef, {
            ...appointmentProps,
        });
    };
    const getAppointments = async (
        appProps: GetAllAppointmentsProps
    ): Promise<Appointment[]> => {
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

        if (userRole === "ADMIN") {
            const collectionRef = collection(firebaseDb, "appointments");
            const querySnapshot = await getDocs(collectionRef);
            return querySnapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id, // The document ID
                        ...doc.data(), // The document data
                    } as Appointment)
            );
        } else if (userRole === "MOD") {
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                appointments.push({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment);
            });
            return appointments;
        } else {
            // Regular users fetch their own appointments
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                appointments.push({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment);
            });
            return appointments;
        }
    };

    const formatAppointments = (appointments: Appointment[]) => {
        var ans: FullCalendarAppointment[] = [];
        for (var i = 0; i < appointments.length; i++) {
            var currApp = appointments[i];
            if (currApp.date == undefined) {
                console.log("no date found");
                continue;
            }
            const appDateObject = new Date(
                (currApp.date as unknown as Timestamp).seconds * 1000
            );
            const dateString = appDateObject.toISOString().split("T")[0];
            const dateTimeString = `${dateString} ${currApp.time}`;
            const startDateObject = new Date(dateTimeString);
            const endDateObject = new Date(dateTimeString);
            endDateObject.setHours(endDateObject.getHours() + 1);
            endDateObject.setMinutes(endDateObject.getMinutes() + 30);
            ans.push({
                id: currApp.id,
                title: "Appointment",
                start: startDateObject,
                end: endDateObject,
                allDay: false,
            });
        }
        return ans;
    };
    const updateAppointmentStatus = async (
            statusProps: UpdateAppointmentStatusProps
        ) => {
            try {
                const docRef = doc(firebaseDb, "appointments", statusProps.id);
                await updateDoc(docRef, {
                    state: statusProps.newStatus,
                });
            } catch (e) {
                console.log(e);
            }
        };
    return { addAppointment, getAppointments, formatAppointments,updateAppointmentStatus };
};
