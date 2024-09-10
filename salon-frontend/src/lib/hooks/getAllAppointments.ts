import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
interface GetAllAppointmentsProps{
    userId: string
}
interface Appointment{
    id: string,
    time: Date,
    length: Date,
    date: Date,
    service1: string,
    tech1: string,
    service2: string,
    tech2: string,
    service3: string,
    tech3: string,
    service4: string,
    tech4: string,
}
interface UseGetAllAppointmentsReturn {
    getAppointments: (appointmentProps: GetAllAppointmentsProps) => Promise<Appointment[]>;
  }
export const useGetAllAppointments = (): UseGetAllAppointmentsReturn => {
  const getAppointments = async (appProps: GetAllAppointmentsProps) => {
    if (!appProps || !appProps.userId) {
      throw new Error('arguments invalid');
    }
    const userId = appProps.userId;
    const userDoc = doc(firebaseDb, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      throw new Error('User does not exist');
    }
    const userRole = userSnapshot.data().role;
    let appointmentsQuery;
    if(userRole == "ADMIN"){
        appointmentsQuery = query(collection(firebaseDb, 'appointments'));
    }else if(userRole == "MOD"){
        appointmentsQuery = query(collection(firebaseDb, 'appointments'), where('userId', '==', userId));
    }else{
        appointmentsQuery = query(collection(firebaseDb, 'appointments'), where('userId', '==', userId));
    }
    const querySnapshot = await getDocs(appointmentsQuery);
    const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    return appointments;
  };
  return { getAppointments };
};