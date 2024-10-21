import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { FullCalendarAppointment } from "@/lib/types/types";
import { getStartAndEndDate } from "@/lib/utils";

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default function WeeklySalonCalendar() {
  const [currentEvents, setCurrentEvents] = useState<FullCalendarAppointment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<FullCalendarAppointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { verifyProfile } = useUserProfile();
  const { user } = useUser();
  const navigate = useNavigate();
  const { getAllSalonAppsThisWeek, formatAppointments } = useAppointment();

  const handleEventClick = (e: EventClickArg) => {
    setSelectedEvent(e.event.extendedProps as FullCalendarAppointment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
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
        endDate: new Date(endStr)
      });
      const formattedApps = formatAppointments(appointments);
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
      <h2 className="text-xl font-semibold mb-2">Weekly Salon Schedule</h2>
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
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedEvent && (
              <div>
                Hi
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}