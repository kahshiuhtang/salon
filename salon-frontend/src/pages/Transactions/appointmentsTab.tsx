"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/lib/types/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface AppointmentTabProps {
    appointments: Appointment[];
    idToNameMapping: Map<string, string>;
    handleAppSelect: (item: Appointment) => void;
}
export default function AppointmentsTab({
    appointments,
    idToNameMapping,
    handleAppSelect
}: AppointmentTabProps) {
    const [filter, setFilter] = useState("");
    const filteredItems = appointments.filter((apt) =>
        apt.services.some(
            (service) =>
                service.service.toLowerCase().includes(filter.toLowerCase()) ||
                service.tech.toLowerCase().includes(filter.toLowerCase())
        )
    );
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input
                        placeholder="Filter appointments..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Technicians</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((apt) => (
                            <TableRow key={apt.id}>
                                <TableCell>
                                    {apt.date.toLocaleDateString()} {apt.time}
                                </TableCell>
                                <TableCell>
                                    {apt.services
                                        .map((s) => s.service)
                                        .join(", ")}
                                </TableCell>
                                <TableCell>
                                    {apt.involvedEmployees
                                        .map((item) => {
                                            if (
                                                item &&
                                                idToNameMapping.has(item)
                                            ) {
                                                return idToNameMapping.get(
                                                    item
                                                );
                                            }
                                            return "";
                                        })
                                        .join(",")}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-56 bg-gray-50 border rounded-sm border-gray-200 shadow-lg"
                                            align="end"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    handleAppSelect(
                                                        apt as Appointment
                                                    );
                                                }}
                                                className="flex items-center cursor-pointer py-2 px-3 focus:bg-gray-100 hover:bg-gray-100"
                                            >
                                                <Pencil className="mr-2 h-4 w-4 text-gray-600" />
                                                <span className="text-gray-700">
                                                    Close Out
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-200" />
                                            <DropdownMenuItem
                                                onClick={() => {}}
                                                className="flex items-center cursor-pointer py-2 px-3 text-red-600 focus:bg-red-50 hover:bg-red-50"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
