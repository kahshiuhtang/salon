import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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
    SalonRole,
} from "@/lib/types/types";
import { getStartAndEndDate } from "@/lib/utils";
import BookAppointmentForm from "../BookAppointment/bookAppointmentForm";
import { useRole } from "@/lib/hooks/useRole";

function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

export default function WeeklySalonCalendar() {
    const [currentEvents, setCurrentEvents] = useState<
        FullCalendarAppointment[]
    >([]);
    const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Appointment | undefined>(
        undefined
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [role, setRole] = useState<SalonRole>("USER");
    const { verifyProfile } = useUserProfile();
    const { user } = useUser();
    const { getRole } = useRole();
    const navigate = useNavigate();
    const { getAllSalonAppsThisWeek, formatAppointments } = useAppointment();

    const handleEventClick = (e: EventClickArg) => {
        for (var i = 0; i < rawAppointments.length; i++) {
            if (rawAppointments[i].id == e.event.id) {
                setSelectedEvent(rawAppointments[i]);
                setIsDialogOpen(true);
                break;
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedEvent(undefined);
    };

    async function handleDateStartMoved(arg: DatesSetArg) {
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
            console.log("handleDateStartMoved(): " + e);
        }
    }

    const fetchAppointments = async () => {
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
    const fetchUserRole = async () => {
        if (!user?.id) {
            console.log("No user id");
            return;
        }
        const userId = user.id;
        const userRole = await getRole({ userId });
        setRole(userRole);
    };
    useEffect(() => {
        fetchAppointments();
        fetchUserRole();
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
                        right: "timeGridDay, timeGridWeek",
                    }}
                    initialView="timeGridWeek"
                    selectable
                    selectMirror
                    dayMaxEvents
                    weekends
                    eventClick={handleEventClick}
                    datesSet={handleDateStartMoved}
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
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
