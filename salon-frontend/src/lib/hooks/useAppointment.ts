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
    deleteDoc,
} from "firebase/firestore";
import {
    ACPService,
    Appointment,
    AppointmentState,
    DailyCalendarAppointment,
    FullCalendarAppointment,
    SalonRole,
    ServiceRequest,
} from "@/lib/types/types";
import { firebaseDb } from "@/lib/firebase";
import { getDateOnlyFromDate } from "@/lib/utils";
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
    services: ServiceRequest[];
    state: AppointmentState;
    ownerId: string;
}
interface GetAllSalonAppsThisWeekProps {
    userId: string;
    startDate: Date;
    endDate: Date;
}
interface DeleteAppointmentProps {
    appId: string;
}
interface UseAppointmentReturn {
    addAppointment: (appointmentProps: AddAppointmentProps) => Promise<void>;
    getAppointments: (
        appointmentProps: GetAllAppointmentsProps
    ) => Promise<Appointment[]>;
    getAppointmentsToday: (
        appointmentProps: GetAllAppointmentsProps
    ) => Promise<Appointment[]>;
    formatAppointments: (
        appointments: Appointment[]
    ) => FullCalendarAppointment[];
    convertAppsForHomePage: (
        appointments: Appointment[]
    ) => DailyCalendarAppointment[];
    updateAppointmentStatus: (
        statusProps: UpdateAppointmentStatusProps
    ) => Promise<void>;
    updateAppointment: (appointment: Appointment) => Promise<void>;
    getPreviousAppointments: (
        props: GetPreviousAppointmentsProp
    ) => Promise<Appointment[]>;
    getFutureAppointments: (
        props: GetFutureAppointmentsProp
    ) => Promise<Appointment[]>;
    getAllSalonAppsThisWeek: (
        props: GetAllSalonAppsThisWeekProps
    ) => Promise<Appointment[]>;
    deleteAppointment: (props: DeleteAppointmentProps) => Promise<void>;
}
export const useAppointment = (): UseAppointmentReturn => {
    const addAppointment = async (appointmentProps: AddAppointmentProps) => {
        const appCollectionRef = collection(firebaseDb, "appointments");
        const techSet = new Set(); // set of people concerned with this appointment
        appointmentProps.services.forEach((service) => {
            techSet.add(service.tech);
        });
        const uniqueTechSet = Array.from(techSet);
        await addDoc(appCollectionRef, {
            ...appointmentProps,
            involvedEmployees: uniqueTechSet,
            hasTransaction: false,
        });
    };
    const deleteAppointment = async (props: DeleteAppointmentProps) => {
        if (!props || !props.appId) return;
        const docRef = doc(firebaseDb, "appointments", props.appId);
        await deleteDoc(docRef);
    };
    const getAllSalonAppsThisWeek = async (
        props: GetAllSalonAppsThisWeekProps
    ): Promise<Appointment[]> => {
        const res: Appointment[] = [];
        try {
            if (!props || !props.startDate || !props.endDate || !props.userId) {
                return res;
            }
            const userDoc = doc(firebaseDb, "users", props.userId);
            const userSnapshot = await getDoc(userDoc);

            if (!userSnapshot.exists()) {
                throw new Error("User does not exist");
            }
            const userRole = userSnapshot.data().role;
            if (userRole == "USER") return res;

            const appointmentsRef = collection(firebaseDb, "appointments"); // Replace with your Firebase collection
            const q = query(
                appointmentsRef,
                where("date", ">=", props.startDate),
                where("date", "<=", props.endDate)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const app = {
                    id: doc.id,
                    ...doc.data(),
                } as Appointment;
                app.date = (app.date as unknown as Timestamp).toDate();
                res.push(app);
            });
            return res;
        } catch (e) {
            console.log("getAllSalonAppsThisWeek(): " + e);
        }
        return [];
    };
    const getAppointments = async (
        appProps: GetAllAppointmentsProps
    ): Promise<Appointment[]> => {
        const userId = appProps.userId;
        if (!userId) {
            return [];
        }
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            throw new Error("User does not exist");
        }

        const userRole = userSnapshot.data().role;

        if (userRole === "ADMIN" || userRole === "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");
            const q = query(
                appointmentsRef,
                where("involvedEmployees", "array-contains", userId)
            );
            const querySnapshot = await getDocs(q);
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                const app = {
                    id: doc.id,
                    ...doc.data(),
                } as Appointment;
                app.date = (app.date as unknown as Timestamp).toDate();
                appointments.push(app);
            });
            return appointments;
        } else {
            // Regular users fetch their own appointments
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("ownerId", "==", userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                const app = {
                    id: doc.id,
                    ...doc.data(),
                } as Appointment;
                app.date = (app.date as unknown as Timestamp).toDate();
                appointments.push(app);
            });
            return appointments;
        }
    };
    const getAppointmentsToday = async (
        appProps: GetAllAppointmentsProps
    ): Promise<Appointment[]> => {
        const userId = appProps.userId;
        if (!userId) {
            return [];
        }
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            throw new Error("User does not exist");
        }

        const userRole = userSnapshot.data().role;
        // const start = startOfDay(new Date()); // Midnight at the start of today
        // const end = endOfDay(new Date());     // 11:59:59.999 PM at the end of today
        // TODO: fix this to choose by date
        if (userRole === "ADMIN" || userRole === "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");
            const q = query(
                appointmentsRef,
                where("involvedEmployees", "array-contains", userId)
            );
            const querySnapshot = await getDocs(q);

            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                const app = {
                    id: doc.id,
                    ...doc.data(),
                } as Appointment;
                app.date = (app.date as unknown as Timestamp).toDate();
                appointments.push(app);
            });
            return appointments;
        } else {
            var appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("ownerId", "==", userId)
            );
            const querySnapshot = await getDocs(appointmentsQuery);
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                const app = {
                    id: doc.id,
                    ...doc.data(),
                } as Appointment;
                app.date = (app.date as unknown as Timestamp).toDate();
                appointments.push(app);
            });
            return appointments;
        }
    };
    const convertAppsForHomePage = (appointments: Appointment[]) => {
        const ans: DailyCalendarAppointment[] = [];
        //TODO: maybe add the firstName, lastName to the appointment?
        for (var i = 0; i < appointments.length; i++) {
            var currApp = appointments[i];
            var services: ACPService[] = [];
            for (var j = 0; j < currApp.services.length; j++) {
                const currService = currApp.services[j];
                // TODO: probably want to combine ACPService with Service type
                services.push({
                    name: currService.service,
                    technician: currService.tech,
                });
            }
            ans.push({
                id: currApp.id,
                date: getDateOnlyFromDate(currApp.date),
                time: currApp.time,
                client: currApp.id,
                services: services,
            });
        }
        return ans;
    };

    const formatAppointments = (appointments: Appointment[]) => {
        var ans: FullCalendarAppointment[] = [];
        for (var i = 0; i < appointments.length; i++) {
            var currApp = appointments[i];
            if (currApp.date == undefined) {
                console.log("no date found");
                continue;
            }
            const appDateObject = new Date(currApp.date);
            const dateString = appDateObject.toISOString().split("T")[0];
            const dateTimeString = `${dateString} ${currApp.time}`;
            const startDateObject = new Date(dateTimeString);
            const endDateObject = new Date(dateTimeString);
            if (currApp.appLength) {
                const [hours, minutes] =
                    currApp && currApp.appLength
                        ? currApp.appLength.split(/:(.*)/s)
                        : ["", ""];
                endDateObject.setHours(
                    endDateObject.getHours() + parseInt(hours)
                );
                endDateObject.setMinutes(
                    endDateObject.getMinutes() + parseInt(minutes)
                );
            } else {
                endDateObject.setHours(endDateObject.getHours() + 1);
                endDateObject.setMinutes(endDateObject.getMinutes() + 30);
            }
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
            console.log("updateAppointmentStatus(): " + e);
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

        const now = new Date();
        if (userRole === "ADMIN" || userRole == "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");

            const q = query(
                appointmentsRef,
                where("involvedEmployees", "array-contains", userId),
                where("time", "<", new Date())
            );

            const querySnapshot = await getDocs(q);
            const appointments = querySnapshot.docs.map(
                (doc) => doc.data() as Appointment
            );

            return appointments;
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
    const updateAppointment = async (appointment: Appointment) => {
        if (!appointment.id) {
            throw new Error(
                "Appointment ID is required to update the document."
            );
        }

        const appointmentRef = doc(firebaseDb, "appointments", appointment.id);

        try {
            await updateDoc(appointmentRef, { ...appointment });
        } catch (error) {
            console.error("Error updating appointment: ", error);
        }
    };
    const getFutureAppointments = async (props: GetFutureAppointmentsProp) => {
        if (!props || !props.userId || !props.role || !props.userFirstName) {
            throw new Error("Arguments invalid");
        }

        const userId = props.userId;
        const userRole = props.role;

        const now = new Date();
        if (userRole === "ADMIN" || userRole == "MOD") {
            const appointmentsRef = collection(firebaseDb, "appointments");
            const q = query(
                appointmentsRef,
                where("involvedEmployees", "array-contains", userId),
                where("time", ">", new Date())
            );

            const querySnapshot = await getDocs(q);
            const appointments = querySnapshot.docs.map(
                (doc) => doc.data() as Appointment
            );
            return appointments;
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
        getAppointmentsToday,
        formatAppointments,
        convertAppsForHomePage,
        updateAppointmentStatus,
        updateAppointment,
        getPreviousAppointments,
        getFutureAppointments,
        getAllSalonAppsThisWeek,
        deleteAppointment,
    };
};
