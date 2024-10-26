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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Availability } from "@/lib/types/types";
import { useAvailability } from "@/lib/hooks/useAvailability";
import { useUser } from "@clerk/clerk-react";
import EditDeleteDropdown from "@/pages/Settings/editDeleteDropdown";
import { Toaster } from "@/components/ui/toaster";

const mockData: Availability[] = [];

export default function AvailabilityListView() {
    const [availabilities, setAvailabilities] =
        useState<Availability[]>(mockData);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { getUnformattedAvailability } = useAvailability();
    const { user } = useUser();
    var userId = user?.id || "";

    const getRepeatText = (availability: Availability) => {
        if (availability.repeatTypeWeekly && availability.repeatTypeDaily)
            return `Repeats ${availability.repeatTypeWeekly} and ${availability.repeatTypeDaily}`;
        if (availability.repeatTypeWeekly)
            return `Repeats ${availability.repeatTypeWeekly}`;
        if (availability.repeatTypeDaily)
            return `Repeats ${availability.repeatTypeDaily}`;
        return "No repeats";
    };

    const confirmDelete = () => {
        if (deletingId) {
            setAvailabilities(
                availabilities.filter((a) => a.id !== deletingId)
            );
            setIsDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const fetchAvailability = async function () {
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
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Availability</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this availability?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
