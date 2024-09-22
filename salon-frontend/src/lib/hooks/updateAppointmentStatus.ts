import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { AppointmentState } from "@/lib/hooks/getAllAppointments";
interface UpdateAppointmentStatusProps {
    id: string;
    newStatus: AppointmentState;
}
interface UseUpdateAppointmentStatusReturn {
    updateAppointmentStatus: (
        statusProps: UpdateAppointmentStatusProps
    ) => Promise<void>;
}
export const useUpdateAppointmentStatus =
    (): UseUpdateAppointmentStatusReturn => {
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
        return { updateAppointmentStatus };
    };
