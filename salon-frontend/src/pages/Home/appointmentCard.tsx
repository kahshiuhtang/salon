"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, User } from "lucide-react";
import {
    SalonRole,
    DailyCalendarAppointment,
    SalonName,
    Appointment,
} from "@/lib/types/types";
import { useEffect, useState } from "react";
import { useUsers } from "@/lib/hooks/useUsers";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BookAppointmentForm from "../BookAppointment/bookAppointmentForm";

interface AppointmentCardProps {
    dailyCalendarApp: DailyCalendarAppointment;
    appointment: Appointment;
    isPast: boolean | undefined;
    userType: SalonRole;
}

export default function AppointmentCard({
    dailyCalendarApp,
    appointment,
    userType,
    isPast = false,
}: AppointmentCardProps) {
    const [usernameCache, setUsernameCache] = useState<{
        [key: string]: SalonName;
    }>({});

    const { getNameFromId } = useUsers();
    const getUsername = async (id: string) => {
        try{
            if (usernameCache[id]) {
                console.log("Username from cache:", usernameCache[id]);
                return usernameCache[id];
            }
    
            const fetchedUsername = await getNameFromId({ userId: id });
    
            setUsernameCache((prevCache) => ({
                ...prevCache,
                [id]: fetchedUsername,
            }));
            return fetchedUsername;
        }catch(e){
            console.log("getUsername(): " + e);
        }
    };
    useEffect(() => {
        for (var i = 0; i < dailyCalendarApp.services.length; i++) {
            const currServices = dailyCalendarApp.services[i];
            getUsername(currServices.technician);
        }
        getUsername(dailyCalendarApp.client);
    }, []);
    //TODO: add AM/PM to appointment time
    return (
        <Card className="mb-4">
            <CardContent className="flex flex-col p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-semibold">
                            {dailyCalendarApp.services.map((s) => s.name).join(", ")}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dailyCalendarApp.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-2 h-4 w-4" />
                            {dailyCalendarApp.time.split(":").slice(0, 2).join(":")}
                        </div>
                    </div>
                    {!isPast && userType === "USER" && (
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <BookAppointmentForm
                                insideCard={true}
                                userRole={userType}
                                appointment={appointment}
                            />
                        </DialogContent>
                    </Dialog>
                    )}
                    {userType !== "USER" && (
                        <Button variant="outline" size="sm">
                            View Details
                        </Button>
                    )}
                </div>
                {userType !== "USER" && (
                    <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" />
                        {usernameCache[dailyCalendarApp.client]
                            ? usernameCache[dailyCalendarApp.client].firstName
                            : ""}
                    </div>
                )}
                <div className="mt-2">
                    <p className="text-sm font-semibold">Services:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {dailyCalendarApp.services.map((service, index) => (
                            <li key={index}>
                                {service.name} with{" "}
                                {usernameCache[service.technician]
                                    ? usernameCache[service.technician]
                                          .firstName
                                    : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
