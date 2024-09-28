import { doc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonGood, SalonService } from "@/lib/types/types";
import { deleteDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
interface DefaultServiceProp{
    userId: string;
    serviceId?: string;
    service: SalonService;
}
interface DefaultGoodProp{
    userId: string;
    goodId: string;
    good: SalonGood;
}
interface UseServiceReturn {
    getServices: () => Promise<SalonService[]>;
    getGoods: () => Promise<SalonGood[]>;
    modifyService: (props: DefaultServiceProp) => Promise<void>;
    modifyGood: (props: DefaultGoodProp) => Promise<void>;
    removeService: (props: DefaultServiceProp) => Promise<void>;
    removeGood: (props: DefaultGoodProp) => Promise<void>;
}
export const useRole = (): UseServiceReturn => {
    // Fetch all services for a given user
    const getServices = async (): Promise<SalonService[]> => {
        const servicesRef = collection(firebaseDb,  "services");
        const servicesSnapshot = await getDocs(servicesRef);
        const servicesList = servicesSnapshot.docs.map(doc => doc.data() as SalonService);
        return servicesList;
    };

    // Fetch all goods for a given user
    const getGoods = async (): Promise<SalonGood[]> => {
        const goodsRef = collection(firebaseDb,"goods");
        const goodsSnapshot = await getDocs(goodsRef);
        const goodsList = goodsSnapshot.docs.map(doc => doc.data() as SalonGood);
        return goodsList;
    };

    // Add or update a service
    const modifyService = async ({ serviceId, service }: DefaultServiceProp): Promise<void> => {
        if (serviceId) {
            // Update existing service
            const serviceDocRef = doc(firebaseDb,  "services", serviceId);
            await updateDoc(serviceDocRef, { ...service });
        } else {
            // Add a new service
            const servicesRef = collection(firebaseDb,  "services");
            await setDoc(doc(servicesRef), { ...service });
        }
    };

    // Add or update a good
    const modifyGood = async ({ goodId, good }: DefaultGoodProp): Promise<void> => {
        if (goodId) {
            // Update existing good
            const goodDocRef = doc(firebaseDb, "goods", goodId);
            await updateDoc(goodDocRef, { ...good });
        } else {
            // Add a new good
            const goodsRef = collection(firebaseDb, "goods");
            await setDoc(doc(goodsRef), { ...good });
        }
    };

    // Remove a service
    const removeService = async ({ serviceId }: DefaultServiceProp): Promise<void> => {
        if (serviceId) {
            const serviceDocRef = doc(firebaseDb, "services", serviceId);
            await deleteDoc(serviceDocRef);
        }
    };

    // Remove a good
    const removeGood = async ({  goodId }: DefaultGoodProp): Promise<void> => {
        if (goodId) {
            const goodDocRef = doc(firebaseDb, "goods", goodId);
            await deleteDoc(goodDocRef);
        }
    };
    return { getServices, getGoods, modifyGood, modifyService, removeService, removeGood };
};
