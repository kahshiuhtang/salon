"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Clock, RepeatIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Availability } from "@/lib/types/types";
import { useAvailability } from "@/lib/hooks/useAvailability";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import EditDeleteDropdown from "@/pages/Settings/editDeleteDropdown";

const mockData: Availability[] = [];

export default function AvailabilityListView() {
    const [availabilities, setAvailabilities] =
        useState<Availability[]>(mockData);

    const { getUnformattedAvailability } = useAvailability();
    const { user } = useUser();
    var userId = user?.id || "";

    function getRepeatText(availability: Availability){
        if (availability.repeatTypeWeekly && availability.repeatTypeDaily)
            return `Repeats ${availability.repeatTypeWeekly} and ${availability.repeatTypeDaily}`;
        if (availability.repeatTypeWeekly)
            return `Repeats ${availability.repeatTypeWeekly}`;
        if (availability.repeatTypeDaily)
            return `Repeats ${availability.repeatTypeDaily}`;
        return "No repeats";
    };
    function updateAvails(availId: string, newAvail: Availability){
        const updatedItems = availabilities.map(availability =>
            availability.id === availId ? { ...newAvail } : availability
        );
        setAvailabilities(updatedItems);
        return true;
    }
    function deleteAvails(availId: string){
        const validAvails = availabilities.filter(availability => availability.id !== availId);
        setAvailabilities(validAvails);
        return true;
    }
    async function fetchAvailability(){
        const availability = await getUnformattedAvailability({ userId });
        setAvailabilities(availability);
    };
    useEffect(() => {
        fetchAvailability();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <Toaster />
            <h2 className="text-2xl font-bold mb-4">Availability List</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Repeat</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {availabilities.map((availability) => (
                        <TableRow key={availability.id}>
                            <TableCell>
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {availability.date.toDateString()}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    {availability.startTime} -{" "}
                                    {availability.endTime}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <RepeatIcon className="mr-2 h-4 w-4" />
                                    {getRepeatText(availability)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <EditDeleteDropdown
                                    availability={availability}
                                    userId={userId}
                                    updateAvails={updateAvails}
                                    deleteAvails={deleteAvails}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
