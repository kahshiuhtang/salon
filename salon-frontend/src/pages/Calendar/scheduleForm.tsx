"use client";

import { Button } from "@/components/ui/button";
import { TimePicker } from "antd";
import { format } from "date-fns";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { z } from "zod";
import { useAppointment } from "@/lib/hooks/useAppointment";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn, groupByType } from "@/lib/utils";
import { CalendarIcon, PlusIcon, MinusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SalonService } from "@/lib/types/types";
import { useService } from "@/lib/hooks/useService";

const timeFormat = "hh:mm a";

const serviceSchema = z.object({
    service: z.string().min(1, { message: "Must choose service" }),
    tech: z.string().min(1, { message: "Must choose technician" }),
});

const formSchema = z.object({
    time: z.date(),
    date: z.date(),
    services: z
        .array(serviceSchema)
        .min(1, { message: "At least one service is required" })
        .max(4),
});
interface ScheduleFormProps {
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ScheduleForm({ setIsDialogOpen }: ScheduleFormProps) {
    const [allServices, setAllServices] = useState<SalonService[]>([]);
    const { toast } = useToast();
    const { user } = useUser();
    const { getServices } = useService();
    const { addAppointment } = useAppointment();
    const navigate = useNavigate();
    if (!user || !user.id) {
        navigate("/sign-in");
    }
    const userId = user?.id || "";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            time: new Date(),
            date: new Date(),
            services: [{ service: "", tech: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "services",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await addAppointment({
            ...values,
            time: values.time.toISOString(),
            state: "REQUESTED",
            ownerId: userId,
        });
        toast({
            title: "Appointment received",
            description: "Check your email for confirmation from staff.",
        });
        setIsDialogOpen(false);
    }
    function doAddService(){
        if (fields.length < 20) {
            append({ service: "", tech: "" });
        }
    };

    function doRemoveService(index: number){
        if (fields.length > 1) {
            remove(index);
        }
    };
    async function fetchServices(){
        try {
            const allServs = await getServices();
            setAllServices(allServs);
        } catch (e) {
            console.log("fetchServices(): " + e);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);
    return (
        <div>
            <Toaster />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <div className="flex justify-start">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mr-2">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[200px] pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 " />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0 opacity-100 bg-white"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => {
                                                    const yesterday =
                                                        new Date();
                                                    yesterday.setDate(
                                                        yesterday.getDate() - 1
                                                    );
                                                    return date < yesterday;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem className="space-y-0 w-[120px] flex flex-col">
                                    <FormLabel className="mb-2">Time</FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            onChange={(time) =>
                                                field.onChange(time?.toDate())
                                            }
                                            value={dayjs(field.value)}
                                            defaultValue={dayjs(
                                                "12:00",
                                                timeFormat
                                            )}
                                            use12Hours={true}
                                            format={timeFormat}
                                            minuteStep={5}
                                            className="h-10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id}>
                            <div className="flex w-full">
                                <FormField
                                    control={form.control}
                                    name={`services.${index}.service`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                Service {index + 1}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            groupByType(
                                                                allServices
                                                            ).entries()
                                                        ).map(
                                                            ([
                                                                type,
                                                                services,
                                                            ]) => (
                                                                <SelectGroup
                                                                    key={type}
                                                                >
                                                                    <SelectLabel>
                                                                        {type}
                                                                    </SelectLabel>
                                                                    {services.map(
                                                                        (
                                                                            service
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    service.id
                                                                                }
                                                                                value={
                                                                                    service.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    service.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectGroup>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`services.${index}.tech`}
                                    render={({ field }) => (
                                        <FormItem className="ml-2 flex-1">
                                            <FormLabel>
                                                Employee {index + 1}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select an employee" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="lee">
                                                            Lee
                                                        </SelectItem>
                                                        <SelectItem value="kim">
                                                            Kim
                                                        </SelectItem>
                                                        <SelectItem value="kimberly">
                                                            Kimberly
                                                        </SelectItem>
                                                        <SelectItem value="marie">
                                                            Marie
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {index !== 0 && index == fields.length - 1 && (
                                <div className="w-full flex justify-end mt-2">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => doRemoveService(index)}
                                        className="mr-2"
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={doAddService}
                                        className="mr-1"
                                        disabled={fields.length >= 4}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="w-full flex justify-between">
                        <div>
                            <Button type="submit">Submit</Button>
                        </div>
                        {fields.length < 2 && (
                            <div className="flex">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={doAddService}
                                    className="mr-1"
                                    disabled={fields.length >= 4}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
