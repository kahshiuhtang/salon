"use client";

import { useAppointment } from "@/lib/hooks/useAppointment";
import { Appointment, AppointmentState } from "@/lib/types/types";
import { useRole } from "@/lib/hooks/useRole";
import { SalonRole } from "@/lib/types/types";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestCard from "./requestCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/lib/hooks/useUsers";

interface AppointmentWithClientName extends Appointment {
    clientName: string;
}

export default function RequestsPage() {
    const [currRole, setCurrRole] = useState<SalonRole>("USER");
    const [requests, setRequests] = useState<AppointmentWithClientName[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<
        AppointmentWithClientName[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<AppointmentState | "ALL">(
        "ALL"
    );
    const { user } = useUser();
    const navigate = useNavigate();
    const { getRole } = useRole();
    const { getAppointments } = useAppointment();
    const { getNameFromId } = useUsers();

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/sign-in");
        }
    }, [user, navigate]);

    const userId = user?.id || "";

    async function fetchRoleAndRequests() {
        try {
            const role = await getRole({ userId });
            const apps = await getAppointments({ userId });
            const appsWithNames = await Promise.all(
                apps.map(async (app) => {
                    const { firstName, lastName } = await getNameFromId({
                        userId: app.ownerId,
                    });
                    return { ...app, clientName: `${firstName} ${lastName}` };
                })
            );
            setCurrRole(role);
            setRequests(appsWithNames);
            setFilteredRequests(appsWithNames);
        } catch (e) {
            console.error("Error fetching role and requests:", e);
        }
    }

    useEffect(() => {
        fetchRoleAndRequests();
    }, []);

    useEffect(() => {
        const filtered = requests.filter((request) => {
            const nameMatch = request.clientName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const statusMatch =
                statusFilter === "ALL" || request.state === statusFilter;
            return nameMatch && statusMatch;
        });
        setFilteredRequests(filtered);
    }, [searchTerm, statusFilter, requests]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value as AppointmentState | "ALL");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {currRole === "ADMIN" && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            Appointment Requests
                        </h1>
                        <div className="mb-6 grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="search" className="mb-2 block">
                                    Search by Client Name
                                </Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Enter client name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="status-filter"
                                    className="mb-2 block"
                                >
                                    Filter by Status
                                </Label>
                                <Select
                                    onValueChange={handleStatusChange}
                                    defaultValue="ALL"
                                >
                                    <SelectTrigger
                                        id="status-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value="REQUESTED">
                                            Requested
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Confirmed
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Changed By User
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Changed By Salon
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem value="MISSED">
                                            Missed
                                        </SelectItem>
                                        <SelectItem value="RESCHEDULED">
                                            Rescheduled
                                        </SelectItem>
                                        <SelectItem value="FINISHED">
                                            Finished
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {filteredRequests.length === 0 ? (
                            <p className="text-gray-600">
                                No appointment requests found.
                            </p>
                        ) : (
                            <div className="grid gap-6">
                                {filteredRequests.map(
                                    (
                                        appointment: AppointmentWithClientName
                                    ) => (
                                        <RequestCard
                                            key={appointment.id}
                                            userRole={currRole}
                                            appointment={appointment}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}
                {currRole === "MOD" && (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">
                            Moderator Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome, Moderator. Your content will be displayed
                            here.
                        </p>
                    </div>
                )}
                {currRole === "USER" && (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">
                            User Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome, User. Your appointments and requests will
                            be displayed here.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
