"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/lib/hooks/useRole";
import { useService } from "@/lib/hooks/useService";
import { SalonGood, SalonService } from "@/lib/types/types";
import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import { useUser } from "@clerk/clerk-react";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "@/pages/Services/serviceForm";

interface ServicePageGroups {
    groupName: string;
    objects: (SalonGood | SalonService)[];
}

export default function ServicesPage() {
    const [services, setServices] = useState<SalonService[]>([]);
    const [goods, setGoods] = useState<SalonGood[]>([]);
    const [itemsToDisplay, setItemsToDisplay] = useState<ServicePageGroups[]>([]);
    const [role, setRole] = useState("USER");
    const [editItem, setEditItem] = useState<SalonGood | SalonService | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { getServices, getGoods, modifyService, modifyGood, removeService, removeGood } = useService();
    const { getRole } = useRole();
    const { user } = useUser();
    const navigate = useNavigate();

    const userId = user?.id || "";
    if (!userId) {
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
        if(!services || !goods){
            console.log("hmm... no services or goods found")
        }
        return items;
    };

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

    const handleUpdate = async (updatedItem: SalonGood | SalonService) => {
        if ("type" in updatedItem) {
            await modifyService({
                userId: userId,
                serviceId: updatedItem.id,
                service: updatedItem as SalonService,
            });
        } else {
            await modifyGood({
                userId: userId,
                goodId: updatedItem.id,
                good: updatedItem as SalonGood,
            });
        }
        fetchServicesAndGoods();
        setEditItem(null);
        setIsDialogOpen(false);
    };

    const handleDelete = async (item: SalonGood | SalonService) => {
        if ("type" in item) {
            await removeService({
                userId: userId,
                serviceId: item.id,
                service: item as SalonService
            });
        } else {
            await removeGood({
                userId: userId,
                goodId: item.id,
                good: item as SalonGood
            });
        }
        // TODO: also fix this here
        fetchServicesAndGoods();
        setEditItem(null);
        setIsDialogOpen(false);
    };

    return (
        <>
            <UnlockedNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {itemsToDisplay.map((category) => (
                        <Card key={category.groupName}>
                            <CardHeader>
                                <CardTitle>
                                    {category.groupName
                                        .charAt(0)
                                        .toUpperCase() +
                                        category.groupName
                                            .slice(1)
                                            .toLowerCase()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.objects.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-muted-foreground">
                                                    {item.time && (
                                                        <>{item.time} Mins: </>
                                                    )}
                                                    <b>${item.price}</b>
                                                </span>
                                                {role !== "USER" && (
                                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setEditItem(item);
                                                                    setIsDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Edit {item.name}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <form
                                                                onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    handleUpdate(
                                                                        editItem as
                                                                            | SalonGood
                                                                            | SalonService
                                                                    );
                                                                }}
                                                                className="space-y-4"
                                                            >
                                                                <div>
                                                                    <Label htmlFor="name">
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id="name"
                                                                        value={
                                                                            editItem?.name ||
                                                                            ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditItem({
                                                                                ...editItem,
                                                                                name: e.target.value,
                                                                            } as
                                                                                | SalonGood
                                                                                | SalonService)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="price">
                                                                        Price
                                                                    </Label>
                                                                    <Input
                                                                        id="price"
                                                                        type="number"
                                                                        value={
                                                                            editItem?.price ||
                                                                            0
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditItem({
                                                                                ...editItem,
                                                                                price: parseFloat(
                                                                                    e.target.value
                                                                                ),
                                                                            } as
                                                                                | SalonGood
                                                                                | SalonService)
                                                                        }
                                                                    />
                                                                </div>
                                                                {"time" in item && (
                                                                    <div>
                                                                        <Label htmlFor="time">
                                                                            Time
                                                                            (minutes)
                                                                        </Label>
                                                                        <Input
                                                                            id="time"
                                                                            type="number"
                                                                            value={
                                                                                (editItem as SalonService)
                                                                                    ?.time || 0
                                                                            }
                                                                            onChange={(e) =>
                                                                                setEditItem({
                                                                                    ...editItem,
                                                                                    time: parseInt(
                                                                                        e.target.value
                                                                                    ),
                                                                                } as SalonService)
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between">
                                                                    <Button type="submit">
                                                                        Save Changes
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        onClick={() => handleDelete(item)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {role !== "USER" && <ServiceForm />}
                <div className="mt-12 text-center">
                    <Button size="lg" variant="default">
                        Book an Appointment
                    </Button>
                </div>
            </div>
        </>
    );
}