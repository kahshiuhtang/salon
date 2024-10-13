import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonNotification } from "@/lib/types/types";
interface NotifyProps {
  userId: string;
  notif: SalonNotification;
}
interface GetNotifProps {
  userId: string;
}
interface GetNotifDateProps {
  userId: string;
  refDate: Date;
  before: boolean;
}
interface GetNotifSeenProps {
  userId: string;
  seenState: boolean;
}
interface DeleteNotifProps {
  userId: string;
  notifId: string;
}
interface UseNotificationReturn {
  notify: (props: NotifyProps) => Promise<string>;
  getNotifications: (props: GetNotifProps) => Promise<SalonNotification[]>;
  getNotificationsByDate: (
    props: GetNotifDateProps
  ) => Promise<SalonNotification[]>;
  getNotificationsBySeenState: (
    props: GetNotifSeenProps
  ) => Promise<SalonNotification[]>;
  deleteNotification: (props: DeleteNotifProps) => Promise<boolean>;
}
export const useNotification = (): UseNotificationReturn => {
  const notify = async function (props: NotifyProps) {
    if (!props || !props.notif || !props.userId) {
      console.log("Invalid arguments passed");
      return "";
    }
    const docRef = await addDoc(
      collection(firebaseDb, `users/${props.userId}/notifications`),
      props.notif
    );
    return docRef.id;
  };

  const getNotifications = async function (props: GetNotifProps) {
    var res: SalonNotification[] = [];
    const notificationsRef = collection(
      firebaseDb,
      `users/${props.userId}/notifications`
    );
    const q = query(notificationsRef, where("seen", "==", true));

    const querySnapshot = await getDocs(q);
    res = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as SalonNotification),
      id: doc.id,
    }));
    return res;
  };

  const getNotificationsByDate = async function (props: GetNotifDateProps) {
    var res: SalonNotification[] = [];
    const notificationsRef = collection(
      firebaseDb,
      `users/${props.userId}/notifications`
    );
    if (props.before) {
      const q = query(notificationsRef, where("createdAt", "<", props.refDate));
      const querySnapshot = await getDocs(q);
      res = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as SalonNotification),
        id: doc.id,
      }));
      return res;
    } else {
      const q = query(notificationsRef, where("createdAt", ">", props.refDate));
      const querySnapshot = await getDocs(q);
      res = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as SalonNotification),
        id: doc.id,
      }));
      return res;
    }
  };

  const getNotificationsBySeenState = async function (
    props: GetNotifSeenProps
  ) {
    var res: SalonNotification[] = [];
    const notificationsRef = collection(
      firebaseDb,
      `users/${props.userId}/notifications`
    );
    const q = query(notificationsRef, where("seen", "==", props.seenState));

    const querySnapshot = await getDocs(q);
    res = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as SalonNotification),
      id: doc.id,
    }));
    return res;
  };

  const deleteNotification = async function (props: DeleteNotifProps) {
    try {
      const notifDocRef = doc(
        firebaseDb,
        `users/${props.userId}/notifications`,
        props.notifId
      );
      await deleteDoc(notifDocRef);
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  };

  return {
    notify,
    getNotifications,
    getNotificationsByDate,
    getNotificationsBySeenState,
    deleteNotification,
  };
};
