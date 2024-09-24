import { addDoc, collection } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { AppointmentState } from "@/lib/hooks/getAllAppointments";
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
interface UseAddAppointmentReturn {
    addAppointment: (appointmentProps: AddAppointmentProps) => Promise<void>;
}
export const useAddAppointment = (): UseAddAppointmentReturn => {
    const appCollectionRef = collection(firebaseDb, "appointments");
    const addAppointment = async (appointmentProps: AddAppointmentProps) => {
        await addDoc(appCollectionRef, {
            ...appointmentProps,
        });
    };
    return { addAppointment };
};
