import { useService } from "@/lib/hooks/useService";
import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";

interface ServiceGoodContextType {
    idToServiceGoodMapping: Map<string, string>;
}

const ServiceGoodContext = createContext<ServiceGoodContextType | undefined>(
    undefined
);

export const ServiceGoodProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [idToServiceGoodMapping, setIdToServiceGoodMapping] = useState<
        Map<string, string>
    >(new Map());
    const { getServices } = useService();
    async function getServiceGoodsMappings() {
        let services = await getServices();
        const globalMapping = services.reduce((map, service) => {
            map.set(service.id, service.name);
            return map;
        }, new Map<string, string>());
        setIdToServiceGoodMapping(globalMapping);
    }
    useEffect(() => {
        getServiceGoodsMappings();
    }, []);
    return (
        <ServiceGoodContext.Provider value={{ idToServiceGoodMapping }}>
            {children}
        </ServiceGoodContext.Provider>
    );
};

export const useServiceGoodContext = () => {
    const context = useContext(ServiceGoodContext);
    if (!context) {
        throw new Error(
            "useServiceGoodContext must be used within a UserProvider"
        );
    }
    return context;
};

export default ServiceGoodProvider;
