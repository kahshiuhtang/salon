import { FullCalendarAppointment } from "@/lib/hooks/getAllAppointments";
import { useGetRole } from "@/lib/hooks/getRole";
import { SalonRole } from "@/lib/types/types";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequestsPage() {
    const [currRole, setCurrRole] = useState<SalonRole>();
    const [requests, setRequests] = useState<FullCalendarAppointment>();
    const { user } = useUser();
    const navigate = useNavigate();
    const { getRole } = useGetRole();
    if (!user || !user.id) {
        navigate("/sign-in");
        return;
    }
    const userId = user.id;
    async function fetchRole() {
        try {
            const role = await getRole({ userId });
            setCurrRole(role);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        fetchRole();
    }, []);
    return (
        <div>
            <Navbar />
            {currRole === "ADMIN" && <div>ADMIN</div>}
            {currRole === "MOD" && <div>MOD</div>}
            {currRole === "USER" && <div>USER</div>}
        </div>
    );
}
