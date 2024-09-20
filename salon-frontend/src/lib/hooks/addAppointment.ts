import { addDoc, collection } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { useUser } from "@clerk/clerk-react";
interface AddAppointmentProps{
    date: Date
    time: string
    service1: string
    tech1: string
    service2?: string
    tech2?: string
    service3?: string
    tech3?: string
    service4?: string
    tech4?: string
}
interface UseAddAppointmentReturn {
    addAppointment: (appointmentProps: AddAppointmentProps) => Promise<void>;
  }
export const useAddAppointment = (): UseAddAppointmentReturn => {
  const appCollectionRef = collection(firebaseDb, "appointments");
  const { user } = useUser();
  var userId = "";
  if(user != null && user["id"] != null) userId = user["id"]
  const addAppointment = async (appointmentProps: AddAppointmentProps) => {
    await addDoc(appCollectionRef, {
      user: userId,
      ...appointmentProps
    });
  };
  return { addAppointment };
};