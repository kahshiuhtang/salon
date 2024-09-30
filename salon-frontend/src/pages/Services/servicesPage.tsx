import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/lib/hooks/useRole";
import { useService } from "@/lib/hooks/useService";
import { SalonGood, SalonService } from "@/lib/types/types";
import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "@/pages/Services/serviceForm";

interface ServicePageGroups {
    groupName: string;
    objects: (SalonGood | SalonService)[];
}
// TODO: allow editing of the services/goods
export default function ServicesPage() {
    const [services, setServices] = useState<SalonService[]>([]);
    const [goods, setGoods] = useState<SalonGood[]>([]);
    const [itemsToDisplay, setItemsToDisplay] = useState<ServicePageGroups[]>(
        []
    );
    const [role, setRole] = useState("USER");
    const { getServices, getGoods } = useService();
    const { getRole } = useRole();
    const { user } = useUser();
    const navigate = useNavigate();
    var userId = "";
    if (user && user.id) {
        userId = user.id;
    } else {
        navigate("/sign-in");
    }
    const processServicesAndGoods = async (
        tempServices: SalonService[],
        tempGoods: SalonGood[]
    ) => {
        const items: ServicePageGroups[] = [];
        const itemMap = new Map<String, ServicePageGroups>();
        tempServices.forEach((service) => {
            const key = service.type;
            if (!itemMap.get(key)) {
                itemMap.set(key, { groupName: key, objects: [] });
            }
            itemMap.get(key)?.objects.push(service);
        });
        tempGoods.forEach((good) => {
            const key = "Goods";
            if (!itemMap.get(key)) {
                itemMap.set(key, { groupName: key, objects: [] });
            }
            itemMap.get(key)?.objects.push(good);
        });
        for (const [_, value] of itemMap) {
            items.push(value);
        }
        return items;
    };
    useEffect(() => {}, [services, goods]);
    const fetchServicesAndGoods = async () => {
        const tempServices = await getServices();
        const tempGoods = await getGoods();
        setServices(tempServices);
        setGoods(tempGoods);
        const processedItems = await processServicesAndGoods(
            tempServices,
            tempGoods
        );
        setItemsToDisplay(processedItems);
    };
    const fetchRole = async () => {
        const tempRole = await getRole({ userId });
        setRole(tempRole);
    };
    useEffect(() => {
        fetchServicesAndGoods();
        fetchRole();
    }, []);

    return (
        <>
            <UnlockedNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {itemsToDisplay.map((category) => (
                        <Card key={category.groupName}>
                            <CardHeader>
                                <CardTitle>{category.groupName.charAt(0).toUpperCase() +category.groupName.slice(1).toLowerCase()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.objects.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {item.time && (
                                                    <>{item.time} Mins:</>
                                                )}{" "}
                                                <b>${item.price}</b>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {role !== "USER" && (
                    <>
                        <ServiceForm></ServiceForm>
                    </>
                )}
                <div className="mt-12 text-center">
                    <Button size="lg" variant={"default"}>
                        Book an Appointment
                    </Button>
                </div>
            </div>
        </>
    );
}
