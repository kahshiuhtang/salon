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
import { useAvailability } from "@/lib/hooks/useAvailability";
import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import AvailabilityForm from "@/pages/Settings/availabilityForm";
import rrulePlugin from "@fullcalendar/rrule";
import DeleteConfirmation, { DeleteConfirmationRef } from "@/pages/Settings/deleteConfirm";
export default function AvailablityCalendar() {
    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        EventInput[]
    >([]);
    const [currEvent, setCurrEvent] = useState<string>("");
    const [open, setOpen] = useState(false);

    const hasFetched = useRef(false);

    const navigate = useNavigate();
    const { user } = useUser();
    const { getAvailability, deleteAvailability } = useAvailability();
    const { verifyProfile } = useUserProfile();

    const deleteConfirmationRef = useRef<DeleteConfirmationRef>(null);

    function confirmOpenDeleteModal(){
        deleteConfirmationRef.current?.openModal()
    }
    function handleTimeframeSelect(selectInfo: DateSelectArg) {
        if(selectInfo){
            console.log(selectInfo);
        }
        setOpen(true);
    }
    async function fetchUserAvailability(){
        try {
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
    function doCalendarClick(e: EventClickArg){
        setCurrEvent(e.event.id);
        confirmOpenDeleteModal();
    };
    async function doDelete(){
        if (user == null || user == undefined || user["id"] == null) {
            console.log("No user id");
            return;
        }
        const userId = user["id"];
        await deleteAvailability({userId, availabilityId: currEvent});
        const updatedEvents = currentAvailabilities.filter(currentAvail => currentAvail.id !== currEvent);
        setCurrEvent("");
        setCurrentAvailabilities(updatedEvents);
    }

    useEffect(() => {
        if (!hasFetched.current && user) {
            fetchUserAvailability();
            hasFetched.current = true;
        }
    }, [user]);
    
    return (
        <>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    rrulePlugin,
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
                eventClick={(info) => doCalendarClick(info)}
                events={currentAvailabilities}
                eventContent={renderEventContent}
                businessHours={{
                    startTime: "9:30",
                    endTime: "21:30",
                }}
                slotMinTime="7:00"
                slotMaxTime="22:00"
            />
            <DeleteConfirmation
                ref={deleteConfirmationRef}
                onDelete={doDelete}
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
