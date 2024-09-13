import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    FullCalendarAppointment,
    useGetAllAppointments,
} from "@/lib/hooks/getAllAppointments";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useVerifyUserProfile } from "@/lib/hooks/verifyUserProfile";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import ScheduleForm from "@/pages/Calendar/scheduleForm";

export default function CalendarScheduler() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEvents, setCurrentEvents] = useState<
        FullCalendarAppointment[]
    >([]);
    const navigate = useNavigate();
    const { user } = useUser();
    if (!user || !user["id"]) {
        navigate("/sign-in");
        return;
    }
    const userId = user.id;
    const fetchEvents = async () => {
        try {
            const { verifyUser } = useVerifyUserProfile();
            const isVerified = await verifyUser({ userId });
            if (!isVerified) navigate("/create-profile");
            const { getAppointments, formatAppointments } =
                useGetAllAppointments();
            const apps = await getAppointments({ userId });
            setCurrentEvents(formatAppointments(apps));
        } catch (e) {
            console.log(e);
        }
    };
    fetchEvents();
    console.log("LLL")
    function handleDateSelect(selectInfo: any) {
        // Probably here can add an onclick
        let title = prompt("Please enter a new title for your event");
        let calendarApi = selectInfo.view.calendar;
        if (title) console.log("Title selected");
        console.log(selectInfo);
        calendarApi.unselect(); // clear date selection
    }

    function handleEventClick(clickInfo: any) {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            clickInfo.event.remove();
        }
    }

    function handleEvents(events: any) {
        setCurrentEvents(events);
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
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    businessHours={{
                        startTime: "7:30", // a start time (10am in this example)
                        endTime: "21:30", // an end time (6pm in this example)
                    }}
                    slotMinTime={"7:00"}
                    slotMaxTime={"22:00"}
                    /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
                />
                <div className="w-full mt-2 flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Schedule</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="">
                                    Create New Appointment
                                </DialogTitle>
                                <DialogDescription>
                                    Schedule an appointment in an available
                                    slot. A staff member will confirm your
                                    appointment at a later time.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="">
                                <ScheduleForm
                                    setIsDialogOpen={setIsDialogOpen}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
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
