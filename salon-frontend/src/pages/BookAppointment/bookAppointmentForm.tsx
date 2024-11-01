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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { cn, convertTimeToDateObject } from "@/lib/utils";
import { CalendarIcon, PlusIcon, MinusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/lib/hooks/useUsers";
import {
    Appointment,
    AppointmentState,
    SalonRole,
    SalonUser,
} from "@/lib/types/types";
import { useEffect, useState } from "react";
import { useNotification } from "@/lib/hooks/useNotification";

const timeFormat = "hh:mm a";

const serviceSchema = z.object({
    service: z.string().min(1, { message: "Must choose service" }),
    tech: z.string().min(1, { message: "Must choose technician" }),
});

const formSchema = z.object({
    time: z.date(),
    date: z.date(),
    hoursLength: z.string().optional(),
    minutesLength: z.string().optional(),
    services: z
        .array(serviceSchema)
        .min(1, { message: "At least one service is required" })
        .max(4),
});
interface BookAppointmentFormProps {
    insideCard?: boolean;
    appointment?: Appointment;
    userRole?: SalonRole;
    forUser?: SalonUser;
}
//TODO: Allow for a message to be sent when booking appointment
export default function BookAppointmentForm({
    insideCard,
    userRole,
    appointment,
    forUser,
}: BookAppointmentFormProps) {
    const [employees, setEmployees] = useState<SalonUser[]>([]);
    const { toast } = useToast();
    const { user } = useUser();
    const navigate = useNavigate();
    const { getAllEmployees } = useUsers();
    const [hours, minutes] =
        appointment && appointment.appLength
            ? appointment.appLength.split(/:(.*)/s)
            : ["", ""];

    if (!user || !user.id) {
        navigate("/sign-in");
    }
    const userId = user?.id || "";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            time: appointment
                ? convertTimeToDateObject(appointment.time)
                : new Date(),
            date: appointment ? appointment.date : new Date(),
            services: appointment
                ? appointment.services
                : [{ service: "", tech: "" }],
            hoursLength: hours,
            minutesLength: minutes,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "services",
    });

    const { addAppointment, updateAppointment } = useAppointment();
    const { notify } = useNotification();
    function sendNotifsToAllParties(
        senderId: string,
        senderTitle: string,
        senderMessage: string,
        recipients: string[],
        receipientTitle: string,
        recipientMessage: string
    ) {
        try {
            const notif = {
                id: "",
                title: senderTitle,
                description: senderMessage,
                senderId: senderId,
                type: "Appointment",
                dateSent: new Date(),
                seen: false,
            };
            notify({ userId: senderId, notif: notif });
            for (var i = 0; i < recipients.length; i++) {
                notif.title = receipientTitle;
                notif.description = recipientMessage;
                notify({ userId: recipients[i], notif: notif });
            }
        } catch (e) {
            console.log("sendNotifsToAllParties(): " + e);
        }
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (appointment) {
                const status: AppointmentState =
                    userRole === "USER" ? "COUNTERED-USER" : "COUNTERED-SALON";
                const techSet = new Set<string>(); // set of people concerned with this appointment
                values.services.forEach((service) => {
                    techSet.add(service.tech);
                });
                const uniqueTechSet = Array.from(techSet);
                if (!values.minutesLength) values.minutesLength = "";
                if (!values.hoursLength) values.hoursLength = "";
                updateAppointment({
                    ...values,
                    id: appointment.id,
                    appLength:
                        values.hoursLength && values.minutesLength
                            ? values.hoursLength + ":" + values.minutesLength
                            : "",
                    involvedEmployees: uniqueTechSet,
                    time: values.time.toLocaleTimeString(),
                    state: status,
                    ownerId: appointment.ownerId,
                });
                toast({
                    title: "Update received",
                    description:
                        "Your requested change has been received. Please wait for confirmation from Salon staff.",
                });
                if (appointment.ownerId == userId) {
                    sendNotifsToAllParties(
                        userId,
                        "Appointment update attempted",
                        "Salon staff will be notified of this update. An update will arrive soon.",
                        uniqueTechSet,
                        "Appointment update attempted",
                        "User has attempted to update on their appointments with you involved. Please approve or counter this request."
                    );
                } else {
                    sendNotifsToAllParties(
                        userId,
                        "Appointment update",
                        "A salon staff member has updated your appointment, please apporve or counter this request.",
                        uniqueTechSet,
                        "Appointment update attempted",
                        "User has been notified of your attempted changes"
                    );
                }
            } else {
                const techSet = new Set<string>(); // set of people concerned with this appointment
                values.services.forEach((service) => {
                    techSet.add(service.tech);
                });
                const uniqueTechSet = Array.from(techSet); // TODO: move this tech set inside addAppointment
                await addAppointment({
                    ...values,
                    time: values.time.toLocaleTimeString(),
                    state: "REQUESTED",
                    ownerId: forUser ? forUser.userId : userId,
                });
                if (forUser) {
                    toast({
                        title: "Appointment received",
                        description:
                            "You have booked an appointment for this user.",
                    });

                    sendNotifsToAllParties(
                        forUser.userId,
                        "Appointment Created",
                        "An appointment has been booked for you on " +
                            values.time.toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            }),
                        uniqueTechSet,
                        "New appointment created",
                        "You have a new appointment on " +
                            values.time.toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })
                    );
                } else {
                    toast({
                        title: "Appointment received",
                        description:
                            "Check your email for confirmation from staff. Press X to close.",
                    });
                    sendNotifsToAllParties(
                        userId,
                        "Appointment created",
                        "You have booked a new appointment on " +
                            values.time.toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            }),
                        uniqueTechSet,
                        "New appointment created",
                        "You have a new appointment on " +
                            values.time.toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })
                    );
                }
            }
        } catch (error) {
            console.error("Error submitting appointment:", error);
            toast({
                title: "Error",
                description:
                    "There was an error submitting your appointment. Please try again.",
                variant: "destructive",
            });
        }
    }

    const addService = () => {
        if (fields.length < 20) {
            append({ service: "", tech: "" });
        }
    };

    const removeService = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };
    const fetchEmployees = async () => {
        try {
            const tempEmployee = await getAllEmployees();
            setEmployees(tempEmployee);
        } catch (e) {
            console.log("fetchEmployees(): " + e);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);
    return (
        <div
            className={cn(
                insideCard ? "" : "flex justify-center items-center mt-24"
            )}
        >
            {!appointment && <Toaster />}
            <Card
                className={cn(
                    insideCard
                        ? ""
                        : "w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 3xl:w-1/5"
                )}
            >
                <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                    <CardTitle>Book an appointment</CardTitle>
                    <CardDescription>
                        Send a request for an appointment
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                                                <span>
                                                                    Pick a date
                                                                </span>
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
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) => {
                                                            const yesterday =
                                                                new Date();
                                                            yesterday.setDate(
                                                                yesterday.getDate() -
                                                                    1
                                                            );
                                                            return (
                                                                date < yesterday
                                                            );
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
                                            <FormLabel className="mb-2">
                                                Time
                                            </FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    onChange={(time) =>
                                                        field.onChange(
                                                            time?.toDate()
                                                        )
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
                                                                <SelectItem value="gel-mani">
                                                                    Gel Manicure
                                                                </SelectItem>
                                                                <SelectItem value="gel-pedi">
                                                                    Gel Pedicure
                                                                </SelectItem>
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
                                                                {employees.map(
                                                                    (
                                                                        employee,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <SelectItem
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    employee.userId
                                                                                }
                                                                            >
                                                                                {
                                                                                    employee.firstName
                                                                                }
                                                                            </SelectItem>
                                                                        );
                                                                    }
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {index !== 0 &&
                                        index == fields.length - 1 && (
                                            <div className="w-full flex justify-end mt-2">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        removeService(index)
                                                    }
                                                    className="mr-2"
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={addService}
                                                    className="mr-1"
                                                    disabled={
                                                        fields.length >= 4
                                                    }
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                </div>
                            ))}
                            {appointment && userRole == "ADMIN" && (
                                <div className="flex space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="hoursLength"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Hours</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select hours" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from(
                                                                { length: 5 },
                                                                (_, i) => (
                                                                    <SelectItem
                                                                        key={i}
                                                                        value={i.toString()}
                                                                    >
                                                                        {i
                                                                            .toString()
                                                                            .padStart(
                                                                                2,
                                                                                "0"
                                                                            )}
                                                                    </SelectItem>
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
                                        name="minutesLength"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Minutes</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select minutes" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[
                                                                0, 15, 30, 45,
                                                            ].map((minute) => (
                                                                <SelectItem
                                                                    key={minute}
                                                                    value={minute.toString()}
                                                                >
                                                                    {minute
                                                                        .toString()
                                                                        .padStart(
                                                                            2,
                                                                            "0"
                                                                        )}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                            {appointment &&
                                userRole == "USER" &&
                                appointment.appLength && (
                                    <div className="flex space-x-4">
                                        <FormField
                                            control={form.control}
                                            name="hoursLength"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>
                                                        Expected Hours
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                            disabled
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select hours" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from(
                                                                    {
                                                                        length: 5,
                                                                    },
                                                                    (_, i) => (
                                                                        <SelectItem
                                                                            key={
                                                                                i
                                                                            }
                                                                            value={i.toString()}
                                                                        >
                                                                            {i
                                                                                .toString()
                                                                                .padStart(
                                                                                    2,
                                                                                    "0"
                                                                                )}
                                                                        </SelectItem>
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
                                            name="minutesLength"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>
                                                        Expected Mins.
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                            disabled
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select minutes" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {[
                                                                    0, 15, 30,
                                                                    45,
                                                                ].map(
                                                                    (
                                                                        minute
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                minute
                                                                            }
                                                                            value={minute.toString()}
                                                                        >
                                                                            {minute
                                                                                .toString()
                                                                                .padStart(
                                                                                    2,
                                                                                    "0"
                                                                                )}
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            <div className="w-full flex justify-between">
                                <div>
                                    <Button type="submit">Submit</Button>
                                </div>
                                {fields.length < 2 && (
                                    <div className="flex">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={addService}
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
                </CardContent>
            </Card>
        </div>
    );
}
