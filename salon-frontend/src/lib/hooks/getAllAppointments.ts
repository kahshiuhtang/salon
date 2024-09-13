import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import dayjs from "dayjs";
interface GetAllAppointmentsProps {
    userId: string;
}
interface Appointment {
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
}
export interface FullCalendarAppointment{
  id: string,           
  title: string,       
  start: string | Date, //  (required)
  end?: string | Date,  //  (optional)
  allDay?: boolean,     //  (optional)
  backgroundColor?: string, //  (optional)
}
interface UseGetAllAppointmentsReturn {
    getAppointments: (
        appointmentProps: GetAllAppointmentsProps
    ) => Promise<Appointment[]>;
    formatAppointments: (appointments: Appointment[]) => FullCalendarAppointment[];
}
export const useGetAllAppointments = (): UseGetAllAppointmentsReturn => {

    const getAppointments = async (appProps: GetAllAppointmentsProps) => {
        if (!appProps || !appProps.userId) {
            throw new Error("arguments invalid");
        }
        const userId = appProps.userId;
        const userDoc = doc(firebaseDb, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()) {
            throw new Error("User does not exist");
        }
        const userRole = userSnapshot.data().role;
        let appointmentsQuery;
        if (userRole == "ADMIN") {
            appointmentsQuery = query(collection(firebaseDb, "appointments"));
        } else if (userRole == "MOD") {
            appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId)
            );
        } else {
            appointmentsQuery = query(
                collection(firebaseDb, "appointments"),
                where("userId", "==", userId)
            );
        }
        const querySnapshot = await getDocs(appointmentsQuery);
        const appointments = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
        );
        return appointments;
    };

    const formatAppointments = (appointments: Appointment[]) => {
      var ans: FullCalendarAppointment[] = [];
      for(var i = 0; i < appointments.length; i++){
        var currApp = appointments[i];
        if(currApp.time == undefined)continue;
        var time = dayjs(currApp.time);
        ans.push({
          id: currApp.id,
          title: "Appointment",       
          start: time.format(),
          end: time.add(1.5, 'hour').format(),
          allDay: false,     
        });
      }
      return ans;
    }
    return { getAppointments, formatAppointments };
};
