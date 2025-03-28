"use client";

import { useAppointment } from "@/lib/hooks/useAppointment";
import { AppointmentState, AppointmentWithClientName } from "@/lib/types/types";
import Navbar from "@/pages/Navbar/navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestCard from "@/pages/Requests/requestCard";
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
import { useUserContext } from "@/contexts/userContext";

export default function RequestsPage() {
  const [requests, setRequests] = useState<AppointmentWithClientName[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    AppointmentWithClientName[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentState | "ALL">(
    "ALL",
  );
  const {user, role} = useUserContext();
  const currRole = role;
  const navigate = useNavigate();
  const { getActiveAppointments } = useAppointment();
  const { getNameFromId } = useUsers();
  useEffect(() => {
    if (!user || !user.id) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const userId = user?.id || "";
  function updateRequests(appId: string, newStatus: AppointmentState) {
    const updatedItems = requests.map((request) =>
      request.id === appId ? { ...request, state: newStatus } : request,
    );
    setRequests(updatedItems);
    return true;
  }
  function deleteRequest(appId: string) {
    const validRequests = requests.filter((request) => request.id !== appId);
    setRequests(validRequests);
    return true;
  }

  useEffect(() => {
    async function fetchRoleAndRequests() {
      try {
        const apps = await getActiveAppointments({ userId });
        const appsWithNames = await Promise.all(
          apps.map(async (app) => {
            const { firstName, lastName } = await getNameFromId({
              userId: app.ownerId,
            });
            return { ...app, clientName: `${firstName} ${lastName}` };
          }),
        );
        setRequests(appsWithNames);
        setFilteredRequests(appsWithNames);
      } catch (e) {
        console.error("Error fetching role and requests:", e);
      }
    }
    fetchRoleAndRequests();
  });

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
        {(currRole === "ADMIN" || currRole == "MOD") && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Appointment Requests</h1>
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
                <Label htmlFor="status-filter" className="mb-2 block">
                  Filter by Status
                </Label>
                <Select onValueChange={handleStatusChange} defaultValue="ALL">
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="REQUESTED">Requested</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CHANGED-USER">
                      Changed By User
                    </SelectItem>
                    <SelectItem value="CHANGED-SALON">
                      Changed By Salon
                    </SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="MISSED">Missed</SelectItem>
                    <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {filteredRequests.length === 0 ? (
              <p className="text-gray-600">No appointment requests found.</p>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map(
                  (appointment: AppointmentWithClientName, index) => (
                    <RequestCard
                      key={index}
                      userRole={currRole}
                      appointment={appointment}
                      updateRequests={updateRequests}
                      deleteRequest={deleteRequest}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        )}
        {currRole === "USER" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
            {filteredRequests.length === 0 ? (
              <p className="text-gray-600">
                Welcome! Your appointments and requests will be displayed here.
              </p>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map(
                  (appointment: AppointmentWithClientName, index) => (
                    <RequestCard
                      key={index}
                      userRole={currRole}
                      appointment={appointment}
                      updateRequests={updateRequests}
                      deleteRequest={deleteRequest}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
