import { doc, getDoc, query, where } from "firebase/firestore";
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
interface GetServiceProps {
    serviceId: string;
}
interface GetSelectServicesProps {
    serviceIds: string[];
}
interface UseServiceReturn {
    getServices: () => Promise<SalonService[]>;
    getSelectServices: (
        props: GetSelectServicesProps
    ) => Promise<Map<string, SalonService>>;
    getGoods: () => Promise<SalonGood[]>;
    getService: (props: GetServiceProps) => Promise<SalonService>;
    modifyService: (props: DefaultServiceProp) => Promise<void>;
    modifyGood: (props: DefaultGoodProp) => Promise<void>;
    removeService: (props: DefaultServiceProp) => Promise<void>;
    removeGood: (props: DefaultGoodProp) => Promise<void>;
}
export const useService = (): UseServiceReturn => {
    const getSelectServices = async (
        props: GetSelectServicesProps
    ): Promise<Map<string, SalonService>> => {
        if (props.serviceIds.length === 0) {
            return new Map();
        }

        const servicesCollection = collection(firebaseDb, "services");

        const q = query(
            servicesCollection,
            where("__name__", "in", props.serviceIds)
        );

        try {
            const querySnapshot = await getDocs(q);
            const resultMap = new Map<string, SalonService>();

            querySnapshot.forEach((doc) => {
                const data = doc.data() as SalonService;
                resultMap.set(doc.id, { ...data, id: doc.id });
            });

            return resultMap;
        } catch (error) {
            console.error("Error fetching services:", error);
            throw new Error("Failed to fetch services.");
        }
    };
    const getService = async (
        props: GetServiceProps
    ): Promise<SalonService> => {
        const docRef = doc(firebaseDb, "services", props.serviceId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) throw new Error("doc does not exist");
        return {
            ...(docSnap.data() as unknown as SalonService),
            id: docSnap.id,
        };
    };
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
        getService,
        getSelectServices,
    };
};
