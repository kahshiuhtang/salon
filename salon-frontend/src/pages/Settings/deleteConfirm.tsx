"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AvailabilityCard from "@/pages/Settings/availabilityCard";

interface DeleteConfirmationProps {
    onDelete: () => void;
}

export interface DeleteConfirmationRef {
    openModal: () => void;
    closeModal: () => void;
}

const DeleteConfirmation = forwardRef<
    DeleteConfirmationRef,
    DeleteConfirmationProps
>(({ onDelete }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));

    function doDelete() {
        onDelete();
        closeModal();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the availability and remove it from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div>
                        <AvailabilityCard />
                        <div className="mt-2">
                            <Button className="ml-2" variant="destructive" onClick={doDelete}>
                                Delete
                            </Button>
                            <Button variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

DeleteConfirmation.displayName = "DeleteConfirmation";

export default DeleteConfirmation;
