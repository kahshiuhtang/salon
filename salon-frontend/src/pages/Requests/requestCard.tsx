"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "antd";
import { deleteDoc, doc } from "firebase/firestore";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

import {
    Appointment,
    AppointmentState,
    SalonName,
    SalonRole,
    SalonService,
} from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useToast } from "@/hooks/use-toast";
import { firebaseDb } from "@/lib/firebase";
import { useUsers } from "@/lib/hooks/useUsers";

import RequestField from "@/pages/Requests/requestField";
import BookAppointmentForm from "@/pages/BookAppointment/bookAppointmentForm";
import { useUser } from "@clerk/clerk-react";
import { useNotification } from "@/lib/hooks/useNotification";
import { useService } from "@/lib/hooks/useService";

interface RequestCardProps {
    appointment: Appointment;
    userRole: SalonRole;
    updateRequests: (appId: string, newStatus: AppointmentState) => boolean;
    deleteRequest: (appId: string) => boolean;
}

const timeFormat = "hh:mm a";

export default function RequestCard({
    appointment,
    userRole,
    updateRequests,
    deleteRequest,
}: RequestCardProps) {
    const [currentAppState, setCurrentAppState] =
        useState<Appointment>(appointment);
    const [allServices, setAllServices] = useState<SalonService[]>([]);
    const [usernameCache, setUsernameCache] = useState<{
        [key: string]: SalonName;
    }>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hours, minutes] = appointment.appLength
        ? appointment.appLength.split(/:(.*)/s)
        : ["", ""];
    const [name, setName] = useState("");
    const { getServices } = useService();
    const appDateObject = new Date(appointment.date);
    const dateString = appDateObject.toISOString().split("T")[0];
    const dateTimeString = `${dateString} ${appointment.time}`;
    const appDate = new Date(dateTimeString);
    const [date, setDate] = useState<Date>(appDate);
    const { updateAppointmentStatus } = useAppointment();
    const { notify } = useNotification();
    const { toast } = useToast();
    const { getNameFromId } = useUsers();
    const { user } = useUser();
    const userId = user?.id || "";
    if (!setDate) console.log("...no set date");
    async function getName(){
        try {
            const { firstName, lastName } = await getNameFromId({
                userId: appointment.ownerId,
            });
            setName(`${firstName} ${lastName}`);
        } catch (e) {
            console.error("Error fetching user name:", e);
            toast({
                title: "Error",
                description:
                    "Unable to fetch user name. Please try again later.",
                variant: "destructive",
            });
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
        getName();
        fetchServices();
        for (var i = 0; i < appointment.services.length; i++) {
            const currServices = appointment.services[i];
            getUsername(currServices.tech);
        }
    }, []);

    async function handleApprove(){
        try {
            if (currentAppState.state === "CONFIRMED") {
                toast({
                    title: "Already Confirmed",
                    description: "This appointment has already been confirmed.",
                });
                return;
            } else if (
                currentAppState.state !== "REQUESTED"
            ) {
                toast({
                    title: "Cannot approve appointment from this state.",
                    description:
                        "Appointment needs to either have been requested by user or countered by the user.",
                });
                return;
            }
            await updateAppointmentStatus({
                id: appointment.id,
                newStatus: "CONFIRMED",
            });
            setCurrentAppState({ ...currentAppState, state: "CONFIRMED" });
            updateRequests(appointment.id, "CONFIRMED");
            toast({
                title: "Appointment Confirmed",
                description: "The appointment has been successfully confirmed.",
            });
            const notif = {
                id: "",
                title: "Appointment Approved",
                description:
                    "Your appointment has been seen and approved by a staff member.",
                senderId: userId,
                type: "Appointment",
                dateSent: new Date(),
                seen: false,
            };
            notify({ userId: appointment.ownerId, notif: notif });
        } catch (e) {
            console.error("Error confirming appointment:", e);
            toast({
                title: "Confirmation Error",
                description:
                    "Unable to confirm the appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    async function handleDelete(){
        try {
            const docRef = doc(firebaseDb, "appointments", appointment.id);
            await deleteDoc(docRef);
            deleteRequest(appointment.id);
            toast({
                title: "Appointment Deleted",
                description:
                    "The appointment has been successfully removed for all users.",
            });
            const notif = {
                id: "",
                title: "Appointment has been deleted.",
                description:
                    "A staff member has canceled your appointment. If this was unintentional, please submit another appointment request.",
                senderId: userId,
                type: "Appointment",
                dateSent: new Date(),
                seen: false,
            };
            notify({ userId: appointment.ownerId, notif: notif });
            setIsDialogOpen(false);
        } catch (e) {
            console.error("Error deleting appointment:", e);
            toast({
                title: "Deletion Error",
                description:
                    "Unable to delete this appointment. Please try again.",
                variant: "destructive",
            });
        }
    };
    async function getUsername(id: string){
        if (usernameCache[id]) {
            return usernameCache[id];
        }
        const fetchedUsername = await getNameFromId({ userId: id });
        setUsernameCache((prevCache) => ({
            ...prevCache,
            [id]: fetchedUsername,
        }));
        return fetchedUsername;
    };

    return (
        <>
            <Toaster />
            <Card
                className={cn(
                    appointment.state == "COUNTERED-SALON" ? "bg-red-100" : appointment.state == "CONFIRMED" ? "bg-green-200" : "",
                    "w-full"
                )}
            >
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>ID: {appointment.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="client-name">Client Name</Label>
                            <Input
                                id="client-name"
                                value={name}
                                placeholder="Loading client name..."
                                disabled
                                aria-label="Client Name"
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="appointment-date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="appointment-date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                ""
                                            )}
                                            disabled
                                        >
                                            {date ? (
                                                format(appDate, "PPP")
                                            ) : (
                                                <span>Select a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={appDate}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="appointment-time">
                                    Start Time
                                </Label>
                                <TimePicker
                                    id="appointment-time"
                                    value={dayjs(date)}
                                    defaultValue={dayjs("12:00", timeFormat)}
                                    use12Hours
                                    format={timeFormat}
                                    minuteStep={5}
                                    className="w-full"
                                    disabled
                                    aria-label="Appointment Start Time"
                                />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold">
                            Expected Duration
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Hours</Label>
                                <Input value={hours} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Minutes</Label>
                                <Input value={minutes} disabled />
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <h3 className="text-lg font-semibold">
                                Requested Services
                            </h3>
                            {appointment.services.map((service, index) => (
                                <RequestField
                                    key={index}
                                    service={service.service}
                                    technician={
                                        usernameCache[service.tech]
                                            ? usernameCache[service.tech]
                                                  .firstName
                                            : "AAA"
                                    }
                                    index={index + 1}
                                    disableInputs={true}
                                    allServices={allServices}
                                />
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="appointment-status">
                                Current Status{" "}
                            </Label>
                            <Input
                                id="appointment-status"
                                value={
                                    currentAppState.state
                                        .charAt(0)
                                        .toUpperCase() +
                                    currentAppState.state.slice(1).toLowerCase()
                                }
                                disabled
                                aria-label="Appointment Status"
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="secondary" onClick={handleApprove}>
                                Approve Appointment
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        Update/Suggest
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <BookAppointmentForm
                                        insideCard={true}
                                        userRole={userRole}
                                        appointment={appointment}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        Cancel Appointment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Cancel Appointment
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to cancel this
                                            appointment? This action cannot be
                                            undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                            >
                                                No, Keep Appointment
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDelete}
                                        >
                                            Yes, Cancel Appointment
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
