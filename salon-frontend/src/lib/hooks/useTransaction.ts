import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { Appointment, SalonTransaction } from "@/lib/types/types";
interface GetTransactionProps {
    userId: string;
    transactionId: string;
}
interface CreateTransactionProps {
    transaction: SalonTransaction;
}
interface UpdateTransactionProps {
    transactionId: string;
    updatedTransaction: Partial<SalonTransaction>;
}
interface DeleteTransactionProps {
    transactionId: string;
}
interface UseTransactionReturn {
    getTransaction: (props: GetTransactionProps) => Promise<SalonTransaction>;
    getTransactions: () => Promise<SalonTransaction[]>;
    createTransaction: (props: CreateTransactionProps) => Promise<void>;
    updateTransaction: (props: UpdateTransactionProps) => Promise<void>;
    deleteTransaction: (props: DeleteTransactionProps) => Promise<void>;
    getUnprocessedApps: () => Promise<Appointment[]>;
}
export const useTransaction = (): UseTransactionReturn => {
    const getTransactions = async () => {
        const transRef = collection(firebaseDb, "transactions");
        const q = query(transRef);
        const querySnapshot = await getDocs(q);
        const trans: SalonTransaction[] = querySnapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                    dateCreated: (
                        doc.data().dateCreated as unknown as Timestamp
                    ).toDate(),
                } as unknown as SalonTransaction)
        );
        return trans;
    };
    const getUnprocessedApps = async () => {
        const appointmentsRef = collection(firebaseDb, "appointments");

        const q = query(
            appointmentsRef,
            where("hasTransaction", "==", false),
            where("state", "==", "CONFIRMED")
        );

        try {
            const querySnapshot = await getDocs(q);
            const appointments: Appointment[] = querySnapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                        date: (
                            doc.data().date as unknown as Timestamp
                        ).toDate(),
                    } as unknown as Appointment)
            );

            return appointments;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw new Error("Failed to retrieve appointments");
        }
    };
    const getTransaction = async (props: GetTransactionProps) => {
        if (!props || !props.userId || !props.transactionId) {
            throw new Error("arguments invalid");
        }
        const transactionRef = doc(
            firebaseDb,
            `transactions/${props.transactionId}`
        );
        const transactionSnapshot = await getDoc(transactionRef);

        if (!transactionSnapshot.exists()) {
            throw new Error("Transaction not found");
        }
        const res: SalonTransaction =
            transactionSnapshot.data() as any as SalonTransaction;
        res.dateTransCreated = (res.dateTransCreated as unknown as Timestamp).toDate();
        res.id = transactionSnapshot.id;
        return res;
    };
    const createTransaction = async (
        props: CreateTransactionProps
    ): Promise<void> => {
        try {
            const transactionRef = doc(
                firebaseDb,
                "transactions",
                props.transaction.id
            );
            await setDoc(transactionRef, props.transaction);
        } catch (error) {
            console.error("Error creating transaction: ", error);
        }
    };

    const updateTransaction = async (
        props: UpdateTransactionProps
    ): Promise<void> => {
        try {
            const transactionRef = doc(
                firebaseDb,
                "transactions",
                props.transactionId
            );
            await updateDoc(transactionRef, props.updatedTransaction);
        } catch (error) {
            console.error("Error updating transaction: ", error);
        }
    };
    const deleteTransaction = async (
        props: DeleteTransactionProps
    ): Promise<void> => {
        try {
            const transactionRef = doc(
                firebaseDb,
                "transactions",
                props.transactionId
            );
            await deleteDoc(transactionRef);
        } catch (error) {
            console.error("Error deleting transaction: ", error);
        }
    };
    return {
        getTransaction,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getUnprocessedApps,
        getTransactions,
    };
};
