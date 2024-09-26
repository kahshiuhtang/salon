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
import {
    Appointment,
    AppointmentState,
    FullCalendarAppointment,
    SalonRole,
} from "@/lib/types/types";
import { firebaseDb } from "@/lib/firebase";
interface GetAllAppointmentsProps {
    userId: string;
}
interface GetPreviousAppointmentsProp {
    userId: string;
    userFirstName: string;
    role: SalonRole;
}
interface GetFutureAppointmentsProp {
    userId: string;
    userFirstName: string;
    role: SalonRole;
}
interface GetAllAppointmentsProps {
    userId: string;
}
interface UpdateAppointmentStatusProps {
    id: string;
    newStatus: AppointmentState;
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
    getPreviousAppointments: (
        props: GetPreviousAppointmentsProp
    ) => Promise<Appointment[]>;
    getFutureAppointments: (
        props: GetFutureAppointmentsProp
    ) => Promise<Appointment[]>;
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
    const getPreviousAppointments = async (
        props: GetPreviousAppointmentsProp
    ) => {
        if (!props || !props.userId || !props.role || !props.userFirstName) {
            throw new Error("Arguments invalid");
        }

        const userId = props.userId;
        const userRole = props.role;

        const appointments = new Set<Appointment>();
        const now = new Date();
        if (userRole === "ADMIN" || userRole == "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");

            const query1 = query(
                appointmentsRef,
                where("tech1", "==", props.userFirstName),
                where("time", "<", now)
            );
            const query2 = query(
                appointmentsRef,
                where("tech2", "==", props.userFirstName),
                where("time", "<", now)
            );
            const query3 = query(
                appointmentsRef,
                where("tech3", "==", props.userFirstName),
                where("time", "<", now)
            );
            const query4 = query(
                appointmentsRef,
                where("tech4", "==", props.userFirstName),
                where("time", "<", now)
            );

            const [snapshot1, snapshot2, snapshot3, snapshot4] =
                await Promise.all([
                    getDocs(query1),
                    getDocs(query2),
                    getDocs(query3),
                    getDocs(query4),
                ]);
            snapshot1.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot2.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot3.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot4.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            const result = Array.from(appointments);
            return result;
        } else {
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId),
                where("time", "<", now)
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
    const getFutureAppointments = async (props: GetFutureAppointmentsProp) => {
        if (!props || !props.userId || !props.role || !props.userFirstName) {
            throw new Error("Arguments invalid");
        }

        const userId = props.userId;
        const userRole = props.role;

        const appointments = new Set<Appointment>();
        const now = new Date();
        if (userRole === "ADMIN" || userRole == "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");

            const query1 = query(
                appointmentsRef,
                where("tech1", "==", props.userFirstName),
                where("time", ">", now)
            );
            const query2 = query(
                appointmentsRef,
                where("tech2", "==", props.userFirstName),
                where("time", ">", now)
            );
            const query3 = query(
                appointmentsRef,
                where("tech3", "==", props.userFirstName),
                where("time", ">", now)
            );
            const query4 = query(
                appointmentsRef,
                where("tech4", "==", props.userFirstName),
                where("time", ">", now)
            );

            const [snapshot1, snapshot2, snapshot3, snapshot4] =
                await Promise.all([
                    getDocs(query1),
                    getDocs(query2),
                    getDocs(query3),
                    getDocs(query4),
                ]);
            snapshot1.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot2.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot3.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            snapshot4.forEach((doc) =>
                appointments.add({
                    id: doc.id,
                    ...doc.data(),
                } as Appointment)
            );
            const result = Array.from(appointments);
            return result;
        } else {
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId),
                where("time", ">", now)
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
    return {
        addAppointment,
        getAppointments,
        formatAppointments,
        updateAppointmentStatus,
        getPreviousAppointments,
        getFutureAppointments,
    };
};
