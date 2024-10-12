"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, RepeatIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import AvailabilityForm  from "@/pages/Settings/availabilityForm"

interface Availability {
  id: string
  date: Date
  startTime: string
  endTime: string
  repeat: boolean
  repeatTypeWeekly?: RepeatTypeWeek
  repeatTypeDaily?: RepeatTypeDay
}

type RepeatTypeWeek = "weekly" | "biweekly" | "monthly"
type RepeatTypeDay = "everyday" | "weekdays" | "weekends"

const mockData: Availability[] = [
  {
    id: "1",
    date: new Date("2023-06-01"),
    startTime: "09:00",
    endTime: "17:00",
    repeat: true,
    repeatTypeWeekly: "weekly",
  },
  {
    id: "2",
    date: new Date("2023-06-02"),
    startTime: "10:00",
    endTime: "18:00",
    repeat: true,
    repeatTypeDaily: "weekdays",
  },
  {
    id: "3",
    date: new Date("2023-06-03"),
    startTime: "11:00",
    endTime: "15:00",
    repeat: false,
  },
]

export default function AvailabilityListView() {
  const [availabilities, setAvailabilities] = useState<Availability[]>(mockData)
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getRepeatText = (availability: Availability) => {
    if (!availability.repeat) return "No repeat"
    if (availability.repeatTypeWeekly) return `Repeats ${availability.repeatTypeWeekly}`
    if (availability.repeatTypeDaily) return `Repeats ${availability.repeatTypeDaily}`
    return "Repeats"
  }

  const handleEdit = (availability: Availability) => {
    setEditingAvailability(availability)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (updatedAvailability: Availability) => {
    setAvailabilities(availabilities.map(a => a.id === updatedAvailability.id ? updatedAvailability : a))
    setIsEditDialogOpen(false)
    setEditingAvailability(null)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId) {
      setAvailabilities(availabilities.filter((a) => a.id !== deletingId))
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
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
                  {format(availability.date, "MMM dd, yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {availability.startTime} - {availability.endTime}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <RepeatIcon className="mr-2 h-4 w-4" />
                  {getRepeatText(availability)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(availability.id)}>
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(availability)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(availability.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
          {editingAvailability && (
            <AvailabilityForm
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this availability? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}