"use client"

import { useState, useImperativeHandle, forwardRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationProps {
  onDelete: () => void
}

export interface DeleteConfirmationRef {
  openModal: () => void
  closeModal: () => void
}

const DeleteConfirmation = forwardRef<DeleteConfirmationRef, DeleteConfirmationProps>(
  ({ onDelete }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    useImperativeHandle(ref, () => ({
      openModal,
      closeModal,
    }))

    const handleDelete = () => {
      onDelete()
      closeModal()
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the availability and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

DeleteConfirmation.displayName = "DeleteConfirmation"

export default DeleteConfirmation