"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Appointment } from "@/lib/hooks/getAllAppointments";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import RequestField from "./requestField";

interface RequestCardProps {
    appointment: Appointment;
    userRole: string;
}
const timeFormat = "HH:mm";
export default function RequestCard({
    appointment,
    userRole,
}: RequestCardProps) {
    const appDateObject = new Date(
        (appointment.date as unknown as Timestamp).seconds * 1000
    );
    const dateString = appDateObject.toISOString().split("T")[0];
    const dateTimeString = `${dateString} ${appointment.time}`;
    const appDate = new Date(dateTimeString);
    const [date, setDate] = useState<Date>(appDate);
    if(!date){
        setDate(date);
    }
    return (
        <Card className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 3xl:w-1/5">
            <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                <CardTitle>Appointment Id:</CardTitle>
                <CardDescription>
                    <div>Id: {appointment.id}</div>
                    <div>
                        Status:{" "}
                        {appointment.state.charAt(0) +
                            appointment.state.substring(1).toLowerCase()}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={appointment.tech1}
                            placeholder="Name of client"
                            disabled
                        />
                    </div>
                    <div className="flex">
                        <div className="flex flex-col space-y-1.5 mr-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            " pl-3 text-left font-normal",
                                            ""
                                        )}
                                        disabled
                                    >
                                        {date ? (
                                            format(appDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 " />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 opacity-100 bg-white"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={appDate}
                                        disabled={(date) => {
                                            const yesterday = new Date();
                                            yesterday.setDate(
                                                yesterday.getDate() - 1
                                            );
                                            return date < yesterday;
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="-mt-1">
                            <Label>Start Time</Label>
                            <TimePicker
                                value={dayjs(date)}
                                defaultValue={dayjs("12:00", timeFormat)}
                                use12Hours
                                format={timeFormat}
                                minuteStep={5}
                                className="h-10"
                                disabled
                            />
                        </div>
                    </div>
                </div>
                {appointment && appointment.service1 && appointment.tech1 && (
                    <RequestField
                        service={appointment.service1}
                        technician={appointment.tech1}
                        index={1}
                    />
                )}
                {appointment && appointment.service2 && appointment.tech2 && (
                    <RequestField
                        service={appointment.service2}
                        technician={appointment.tech2}
                        index={2}
                    />
                )}
                {appointment && appointment.service3 && appointment.tech3 && (
                    <RequestField
                        service={appointment.service3}
                        technician={appointment.tech3}
                        index={3}
                    />
                )}
                {appointment && appointment.service4 && appointment.tech4 && (
                    <RequestField
                        service={appointment.service4}
                        technician={appointment.tech4}
                        index={4}
                    />
                )}
                {(userRole === "ADMIN" || userRole === "MOD") && (
                    <div className="mt-2">
                        <Button className="mr-1" variant="secondary">
                            Approve
                        </Button>
                        <Button className="mr-1" variant="outline">
                            Counter
                        </Button>
                        <Button className="mr-1" variant="destructive">
                            Decline
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
