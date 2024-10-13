"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, User } from "lucide-react";
import {
    SalonRole,
    DailyCalendarAppointment,
    SalonName,
} from "@/lib/types/types";
import { useEffect, useState } from "react";
import { useUsers } from "@/lib/hooks/useUsers";

interface AppointmentCardProps {
    appointment: DailyCalendarAppointment;
    isPast: boolean | undefined;
    userType: SalonRole;
}

export default function AppointmentCard({
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
        for (var i = 0; i < appointment.services.length; i++) {
            const currServices = appointment.services[i];
            getUsername(currServices.technician);
        }
        getUsername(appointment.client);
    }, []);
    //TODO: add AM/PM to appointment time
    return (
        <Card className="mb-4">
            <CardContent className="flex flex-col p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-semibold">
                            {appointment.services.map((s) => s.name).join(", ")}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-2 h-4 w-4" />
                            {appointment.time.split(":").slice(0, 2).join(":")}
                        </div>
                    </div>
                    {!isPast && userType === "USER" && (
                        <Button variant="outline" size="sm">
                            Reschedule
                        </Button>
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
                        {usernameCache[appointment.client]
                            ? usernameCache[appointment.client].firstName
                            : ""}
                    </div>
                )}
                <div className="mt-2">
                    <p className="text-sm font-semibold">Services:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {appointment.services.map((service, index) => (
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
