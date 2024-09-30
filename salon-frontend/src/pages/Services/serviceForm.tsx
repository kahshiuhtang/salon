"use client";
// TODO: split dialog from form
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { SalonGood, SalonService } from "@/lib/types/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
const salonServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum([
        "MANICURE",
        "TIP SET",
        "WAXING",
        "PEDICURE",
        "MISC",
    ] as const),
    price: z.number().min(0, "Price must be positive"),
    time: z.number().min(1, "Time must be at least 1 minute"),
});

const salonGoodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be positive"),
});

export default function ServiceForm() {
    const [activeTab, setActiveTab] = useState<"service" | "good">("service");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const serviceForm = useForm<SalonService>({
        resolver: zodResolver(salonServiceSchema),
        defaultValues: {
            id: "",
            name: "",
            type: "TIP SET",
            price: 0,
            time: 60,
        },
    });

    const goodForm = useForm<SalonGood>({
        resolver: zodResolver(salonGoodSchema),
        defaultValues: {
            id: "",
            name: "",
            price: 0,
        },
    });

    const onSubmit = async (data: SalonService | SalonGood) => {
        try {
            const db = getFirestore();
            const collectionName =
                activeTab === "service" ? "services" : "goods";
            await addDoc(collection(db, collectionName), {
                ...data,
            });
            toast({
                title: "Success",
                description: `${
                    activeTab === "service" ? "Service" : "Good"
                } added successfully`,
            });
            setIsDialogOpen(false);
            activeTab === "service" ? serviceForm.reset() : goodForm.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Add Salon Item</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Salon Item</DialogTitle>
                        <DialogDescription>
                            Create a new salon service or good. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                            setActiveTab(value as "service" | "good")
                        }
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="service">Service</TabsTrigger>
                            <TabsTrigger value="good">Good</TabsTrigger>
                        </TabsList>
                        <TabsContent value="service">
                            <Form {...serviceForm}>
                                <form
                                    onSubmit={serviceForm.handleSubmit(
                                        onSubmit
                                    )}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={serviceForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Manicure"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={serviceForm.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a service type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MANICURE">
                                                            Manicure
                                                        </SelectItem>
                                                        <SelectItem value="TIP SET">
                                                            Tip Set
                                                        </SelectItem>
                                                        <SelectItem value="WAXING">
                                                            Waxing
                                                        </SelectItem>
                                                        <SelectItem value="PEDICURE">
                                                            Pedicure
                                                        </SelectItem>
                                                        <SelectItem value="MISC">
                                                            Miscellaneous
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={serviceForm.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={serviceForm.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Time (minutes)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Save Service</Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="good">
                            <Form {...goodForm}>
                                <form
                                    onSubmit={goodForm.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={goodForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nail Polish"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={goodForm.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Save Good</Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
            <Toaster />
        </>
    );
}
