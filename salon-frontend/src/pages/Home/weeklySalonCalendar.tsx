import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import {
    Appointment,
    FullCalendarAppointment,
} from "@/lib/types/types";
import { getStartAndEndDate } from "@/lib/utils";
import BookAppointmentForm from "@/pages/BookAppointment/bookAppointmentForm";
import { useUserContext } from "@/contexts/userContext";

function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

export default function WeeklySalonCalendar() {
    const { verifyProfile } = useUserProfile();
    const {role, user }= useUserContext();
    const { getAllSalonAppsThisWeek, formatAppointments } = useAppointment();

    const navigate = useNavigate();

    const [currentEvents, setCurrentEvents] = useState<
        FullCalendarAppointment[]
    >([]);
    const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Appointment | undefined>(
        undefined
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function onEventClick(e: EventClickArg){
        for (var i = 0; i < rawAppointments.length; i++) {
            if (rawAppointments[i].id == e.event.id) {
                setSelectedEvent(rawAppointments[i]);
                setIsDialogOpen(true);
                break;
            }
        }
    };

    async function onCloseDialog(){
        setIsDialogOpen(false);
        setSelectedEvent(undefined);
    };

    async function onDateSetChanged(arg: DatesSetArg) {
        try {
            if (!user?.id) {
                console.log("No user id");
                return;
            }
            const { startStr, endStr } = arg;
            const appointments = await getAllSalonAppsThisWeek({
                userId: user.id,
                startDate: new Date(startStr),
                endDate: new Date(endStr),
            });
            const formattedApps = formatAppointments(appointments);
            setRawAppointments(appointments);
            setCurrentEvents(formattedApps);
        } catch (e) {
            console.log("onDateSetChanged(): " + e);
        }
    }

    async function fetchAppointments(){
        try {
            console.log("fetching data...");
            if (!user?.id) {
                console.log("No user id");
                return;
            }
            const isVerified = await verifyProfile({ userId: user.id });
            if (!isVerified) {
                navigate("/create-profile");
                return;
            }
            const startingEdgeDates = getStartAndEndDate(new Date());
            const appointments = await getAllSalonAppsThisWeek({
                userId: user.id,
                startDate: startingEdgeDates.startDate,
                endDate: startingEdgeDates.endDate,
            });
            setRawAppointments(appointments);
            const formattedApps = formatAppointments(appointments);
            setCurrentEvents(formattedApps);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, [user]);

    return (
        <div className="mt-4 max-w-full max-h-full">
            <h2 className="text-xl font-semibold mb-2">
                Weekly Salon Schedule
            </h2>
            <div className="max-w-full max-h-full">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "timeGridWeek,timeGridDay",
                    }}
                    initialView="timeGridWeek"
                    selectable
                    selectMirror
                    dayMaxEvents
                    weekends
                    eventClick={onEventClick}
                    datesSet={onDateSetChanged}
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Appointment</DialogTitle>
                    </DialogHeader>
                    <BookAppointmentForm
                        insideCard={true}
                        userRole={role}
                        appointment={selectedEvent}
                    />
                    <DialogFooter>
                        <Button onClick={onCloseDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
