import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ScheduleForm from "@/pages/Calendar/scheduleForm";
import { FullCalendarAppointment } from "@/lib/types/types";

export default function CalendarScheduler() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEvents, setCurrentEvents] = useState<
        FullCalendarAppointment[]
    >([]);
    const navigate = useNavigate();
    const { user } = useUser();
    const { verifyProfile } = useUserProfile();
    const { getAppointments, formatAppointments } = useAppointment();

    // Fetch appointments, only when userId is available
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
    const hasFetched = useRef(false);
    useEffect(() => {
        if (!hasFetched.current && user) {
            fetchAppointments();
            hasFetched.current = true;
        }
    }, [user]);

    function handleDateSelect(selectInfo: any) {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selectInfo.view.calendar;
        if (title) {
            console.log("Event Title:", title);
        }
        calendarApi.unselect();
    }

    function handleEventClick(clickInfo: any) {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'?`
            )
        ) {
            clickInfo.event.remove();
        }
    }
    return (
        <div className="w-full flex justify-center mt-8">
            <div className="w-3/4">
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
                    events={currentEvents}
                    select={handleDateSelect}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    businessHours={{
                        startTime: "9:30",
                        endTime: "21:30",
                    }}
                    slotMinTime="7:00"
                    slotMaxTime="22:00"
                />
                <div className="w-full mt-2 flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Schedule</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Create New Appointment
                                </DialogTitle>
                                <DialogDescription>
                                    Schedule an appointment in an available
                                    slot. A staff member will confirm your
                                    appointment at a later time.
                                </DialogDescription>
                            </DialogHeader>
                            <ScheduleForm setIsDialogOpen={setIsDialogOpen} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

// Custom event content renderer
function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
