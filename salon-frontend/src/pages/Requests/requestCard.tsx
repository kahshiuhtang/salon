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

import { Appointment } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useToast } from "@/hooks/use-toast";
import { firebaseDb } from "@/lib/firebase";
import { useUsers } from "@/lib/hooks/useUsers";

import RequestField from "./requestField";
import BookAppointmentForm from "@/pages/BookAppointment/bookAppointmentForm";

interface RequestCardProps {
    appointment: Appointment;
    userRole: string;
}

const timeFormat = "hh:mm a";

export default function RequestCard({
    appointment,
    userRole,
}: RequestCardProps) {
    const [currentAppState, setCurrentAppState] =
        useState<Appointment>(appointment);
    const [name, setName] = useState("");
    const appDateObject = new Date(appointment.date);
    const dateString = appDateObject.toISOString().split("T")[0];
    const dateTimeString = `${dateString} ${appointment.time}`;
    const appDate = new Date(dateTimeString);
    const [date, setDate] = useState<Date>(appDate);
    const { updateAppointmentStatus } = useAppointment();
    const { toast } = useToast();
    const { getNameFromId } = useUsers();
    if (!setDate) console.log("...no set date");
    const getName = async function () {
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

    useEffect(() => {
        getName();
    }, []);

    const handleApprove = async function () {
        try {
            if (currentAppState.state === "CONFIRMED") {
                toast({
                    title: "Already Confirmed",
                    description: "This appointment has already been confirmed.",
                });
                return;
            }
            await updateAppointmentStatus({
                id: appointment.id,
                newStatus: "CONFIRMED",
            });
            setCurrentAppState({ ...currentAppState, state: "CONFIRMED" });
            toast({
                title: "Appointment Confirmed",
                description: "The appointment has been successfully confirmed.",
            });
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

    const handleDelete = async function () {
        try {
            const docRef = doc(firebaseDb, "appointments", appointment.id);
            await deleteDoc(docRef);
            toast({
                title: "Appointment Deleted",
                description:
                    "The appointment has been successfully removed for all users.",
            });
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

    return (
        <>
            <Toaster />
            <Card className="w-full">
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
                        <div className="grid gap-4">
                            <h3 className="text-lg font-semibold">
                                Requested Services
                            </h3>
                            {appointment.services.map((service, index) => (
                                <RequestField
                                    key={index}
                                    service={service.service}
                                    technician={service.tech}
                                    index={index + 1}
                                />
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="appointment-status">
                                Current Status
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
                        {(userRole === "ADMIN" || userRole === "MOD") && (
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={handleApprove}
                                >
                                    Approve Appointment
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Suggest Changes
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                    <BookAppointmentForm insideCard={true}/>
                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                >
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
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
                                                Are you sure you want to cancel
                                                this appointment? This action
                                                cannot be undone.
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
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
