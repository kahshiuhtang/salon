import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FullCalendarAppointment } from "@/lib/types/types";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core/index.js";


interface DailyCalendarProps {
    date: string;
}
// TODO: add some name infromation...?
function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
function handleTimeframeSelect(selectInfo: DateSelectArg) {
    const { startStr, endStr } = selectInfo;
    console.log(new Date(startStr));
    console.log(new Date(endStr));
}
export default function DailyCalendar({
    date,
}: DailyCalendarProps) {
    const [currentEvents, setCurrentEvents] = useState<FullCalendarAppointment[]>(
        []
    );
    const [_, setCurrEvent] = useState<string>("");
    const { verifyProfile } = useUserProfile();
    const { user } = useUser();
    const navigate = useNavigate();
    const { getAppointments, formatAppointments } = useAppointment();
    const handleEventClick = (e: EventClickArg) => {
        setCurrEvent(e.event.id);
    };
    const fetchAppointments = async () => {
        try {
            console.log("fetching data...");
            if (user == null || user == undefined || user["id"] == null) {
                console.log("No user id");
                return;
            }
            const userId = user["id"];
            const isVerified = await verifyProfile({ userId });
            if (!isVerified) {
                navigate("/create-profile");
                return;
            }
            const appointments = await getAppointments({ userId });
            const formattedApps = formatAppointments(appointments);
            setCurrentEvents(formattedApps);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, []);
    useEffect(() => {
        fetchAppointments();
    }, [user]);
    return (
        <div className="mt-4 max-w-full max-h-full">
            <h2 className="text-xl font-semibold mb-2">
                Daily Schedule - {date}
            </h2>
            <div className="max-w-full max-h-full">
                
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay",
                }}
                initialView="timeGridWeek"
                editable
                selectable
                select={handleTimeframeSelect}
                selectMirror
                dayMaxEvents
                weekends
                eventClick={(info) => handleEventClick(info)}
                events={currentEvents}
                eventContent={renderEventContent}
                businessHours={{
                    startTime: "9:30",
                    endTime: "21:30",
                }}
                slotMinTime="7:00"
                slotMaxTime="22:00"
            />
            </div>
        </div>
    );
}
