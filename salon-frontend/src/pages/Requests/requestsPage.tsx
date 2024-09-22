import {
    Appointment,
    useGetAllAppointments,
} from "@/lib/hooks/getAllAppointments";
import { useGetRole } from "@/lib/hooks/getRole";
import { SalonRole } from "@/lib/types/types";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestCard from "./requestCard";

export default function RequestsPage() {
    const [currRole, setCurrRole] = useState<SalonRole>("USER");
    const [requests, setRequests] = useState<Appointment[]>([]);
    const { user } = useUser();
    const navigate = useNavigate();
    const { getRole } = useGetRole();
    const { getAppointments } = useGetAllAppointments();
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
            setCurrRole(role);
            setRequests(apps);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        fetchRoleAndRequests();
    }, []);
    return (
        <div>
            <Navbar />
            {currRole === "ADMIN" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 m-8">
                    {requests.map((appointment: Appointment, index: number) => {
                        return (
                            <div className="w-full max-w-[600px]" key={index}>
                                <RequestCard
                                    userRole={currRole}
                                    appointment={appointment}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            {currRole === "MOD" && <div>MOD</div>}
            {currRole === "USER" && <div>USER</div>}
        </div>
    );
}
