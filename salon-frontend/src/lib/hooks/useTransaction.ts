import { deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonTransaction } from "@/lib/types/types";
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
    createTransaction: (props: CreateTransactionProps) => Promise<void>;
    updateTransaction: (props: UpdateTransactionProps) => Promise<void>;
    deleteTransaction: (props: DeleteTransactionProps) => Promise<void>;
}
export const useTransaction = (): UseTransactionReturn => {
    const getTransaction = async (props: GetTransactionProps) => {
        if (!props || !props.userId || !props.transactionId) {
            throw new Error("arguments invalid");
        }
        const transactionRef = doc(firebaseDb, `users/${props.userId}/transactions/${props.transactionId}`);
        const transactionSnapshot = await getDoc(transactionRef);

        if (!transactionSnapshot.exists()) {
            throw new Error("Transaction not found");
        }
        const res: SalonTransaction = transactionSnapshot.data() as any as SalonTransaction;
        res.dateCreated = (res.dateCreated as unknown as Timestamp).toDate();
        res.id = transactionSnapshot.id;
        return res;
    };
    const createTransaction = async (props: CreateTransactionProps): Promise<void> => {
        try {
          const transactionRef = doc(firebaseDb, "transactions", props.transaction.id);
          await setDoc(transactionRef, props.transaction);
        } catch (error) {
          console.error("Error creating transaction: ", error);
        }
      };
      
      const updateTransaction = async (props: UpdateTransactionProps): Promise<void> => {
        try {
          const transactionRef = doc(firebaseDb, "transactions", props.transactionId);
          await updateDoc(transactionRef, props.updatedTransaction);
        } catch (error) {
          console.error("Error updating transaction: ", error);
        }
      };
      const deleteTransaction = async (props: DeleteTransactionProps): Promise<void> => {
        try {
          const transactionRef = doc(firebaseDb, "transactions", props.transactionId);
          await deleteDoc(transactionRef);
        } catch (error) {
          console.error("Error deleting transaction: ", error);
        }
      };
    return { getTransaction, createTransaction, updateTransaction, deleteTransaction };
};