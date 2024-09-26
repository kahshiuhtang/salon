import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useUser } from "@clerk/clerk-react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import {
    FormattedAvailability,
    useAvailability,
} from "@/lib/hooks/useAvailability";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import AvailabilityForm from "./availabilityForm";
export default function AvailablityCalendar() {
    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        FormattedAvailability[]
    >([]);
    const [open, setOpen] = useState(false);
    function handleTimeframeSelect(selectInfo: DateSelectArg) {
        const { startStr, endStr } = selectInfo;
        console.log(new Date(startStr));
        console.log(new Date(endStr));
        setOpen(true);
    }
    const navigate = useNavigate();
    const { user } = useUser();
    const { getAvailability } = useAvailability();
    const { verifyProfile } = useUserProfile();
    const fetchUserAvailability = async () => {
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
            const avails = await getAvailability({ userId });
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
        <>
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
                select={handleTimeframeSelect}
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
            <Dialog open={open}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Availability</DialogTitle>
                        <DialogDescription>
                            Set aside this time block as a period where you are
                            available
                        </DialogDescription>
                    </DialogHeader>
                    <AvailabilityForm />
                    <DialogFooter className="sm:justify-start"></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
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
