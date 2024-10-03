import { doc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { SalonGood, SalonService } from "@/lib/types/types";
import { deleteDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
interface DefaultServiceProp {
    userId: string;
    serviceId?: string;
    service: SalonService;
}
interface DefaultGoodProp {
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
export const useService = (): UseServiceReturn => {
    const getServices = async (): Promise<SalonService[]> => {
        const servicesRef = collection(firebaseDb, "services");
        const servicesSnapshot = await getDocs(servicesRef);
        const servicesList = servicesSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                } as SalonService)
        );
        return servicesList;
    };

    const getGoods = async (): Promise<SalonGood[]> => {
        const goodsRef = collection(firebaseDb, "goods");
        const goodsSnapshot = await getDocs(goodsRef);
        const goodsList = goodsSnapshot.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                } as SalonGood)
        );
        return goodsList;
    };

    const modifyService = async ({
        serviceId,
        service,
    }: DefaultServiceProp): Promise<void> => {
        if (serviceId) {
            const serviceDocRef = doc(firebaseDb, "services", serviceId);
            await updateDoc(serviceDocRef, { ...service });
        }
    };

    const modifyGood = async ({
        goodId,
        good,
    }: DefaultGoodProp): Promise<void> => {
        if (goodId) {
            const goodDocRef = doc(firebaseDb, "goods", goodId);
            await updateDoc(goodDocRef, { ...good });
        }
    };

    const removeService = async ({
        serviceId,
    }: DefaultServiceProp): Promise<void> => {
        if (serviceId) {
            const serviceDocRef = doc(firebaseDb, "services", serviceId);
            await deleteDoc(serviceDocRef);
        }
    };

    const removeGood = async ({ goodId }: DefaultGoodProp): Promise<void> => {
        if (goodId) {
            const goodDocRef = doc(firebaseDb, "goods", goodId);
            await deleteDoc(goodDocRef);
        }
    };
    return {
        getServices,
        getGoods,
        modifyGood,
        modifyService,
        removeService,
        removeGood,
    };
};
