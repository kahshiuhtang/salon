"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import AvailabilityCard from "@/pages/Settings/availabilityCard";
import { Availability } from "@/lib/types/types";
import { useAvailability } from "@/lib/hooks/useAvailability";

interface EditDeleteDropdownProps {
    availability: Availability;
    updateAvails: (availId: string, newAvail: Availability) => boolean; 
    deleteAvails: (availId: string) => boolean; 
    userId: string;
}
export default function EditDeleteDropdown({
    availability,
    userId,
    updateAvails,
    deleteAvails
}: EditDeleteDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { deleteAvailability } = useAvailability();

    const handleEdit = () => {
        setIsDropdownOpen(false);
        setIsEditDialogOpen(true);
    };

    const handleDelete = () => {
        setIsDropdownOpen(false);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setIsDeleteDialogOpen(false);
        deleteAvailability({ userId, availabilityId: availability.id });
        deleteAvails(availability.id);
    };

    return (
        <div>
            <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <AvailabilityCard availability={availability} updateAvails={updateAvails}/>
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
                            Are you sure you want to delete this item? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
