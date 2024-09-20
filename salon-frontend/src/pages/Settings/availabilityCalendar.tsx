import {useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useUser } from "@clerk/clerk-react";
import { useVerifyUserProfile } from "@/lib/hooks/verifyUserProfile";
import { useNavigate } from "react-router-dom";
import { FormattedAvailability, useGetAvailability } from "@/lib/hooks/getCurrentAvailabilities";

export default function AvailablityCalendarAST() {
    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        FormattedAvailability[]
    >([]);
    const navigate = useNavigate();
    const { user } = useUser();
    const {getAvailability} = useGetAvailability();
    const { verifyUser } = useVerifyUserProfile();
    const fetchUserAvailability = async () => {
        try {
            console.log("fetching data...");
            if (user == null || user == undefined || user["id"] == null) {
                console.log("No user id");
                return;
            }
            const userId = user["id"];
            const isVerified = await verifyUser({ userId });
            if (!isVerified) {
                navigate("/create-profile");
                return;
            }
            const avails = await getAvailability({userId});
            setCurrentAvailabilities(avails);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    const hasFetched = useRef(false);
    useEffect(() => {
        if (!hasFetched.current && user) {
            fetchUserAvailability();
            hasFetched.current = true;
        }
    }, [user]);
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends
            events={currentAvailabilities}
            eventContent={renderEventContent}
            businessHours={{
                startTime: "9:30",
                endTime: "21:30",
            }}
            slotMinTime="7:00"
            slotMaxTime="22:00"
        />
    );
}
function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
