import { useState } from "react";
import { Calendar, View, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import BookAppointmentForm from "@/pages/BookAppointment/bookAppointmentForm";
import { momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Appointment, SalonRole } from "@/lib/types/types";
const localizer = momentLocalizer(moment);
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
const allViews: View[] = ["agenda", "day", "week", "month"];

interface SelectableCalendarProps {
  localizer: DateLocalizer;
  appointments: Appointment[];
  role: SalonRole | undefined
}

class CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  desc: string;
  resourceId?: string;
  tooltip?: string;

  constructor(
    _title: string,
    _start: Date,
    _endDate: Date,
    _allDay?: boolean,
    _desc?: string,
    _resourceId?: string
  ) {
    this.title = _title;
    this.allDay = _allDay || false;
    this.start = _start;
    this.end = _endDate;
    this.desc = _desc || "";
    this.resourceId = _resourceId;
  }
}
function parseAppLength(length: string): number {
  const [hours, minutes] = length.split(":").map(Number)
  return (hours * 60 + minutes) * 60 * 1000
} 
function appointmentToCalendarEvent(app: Appointment): CalendarEvent {
  return new CalendarEvent(
    app.services.map(s => s.service).join(", ") || "New Event", // title from services
    new Date(app.date.getFullYear(), app.date.getMonth(), app.date.getDate(), ...app.time.split(/[: ]/).map(Number).slice(0,2)), // start
    new Date(new Date(app.date.getFullYear(), app.date.getMonth(), app.date.getDate(), ...app.time.split(/[: ]/).map(Number).slice(0,2)).getTime() + parseAppLength(app.appLength)), // end
    false, // allDay
    `Owner: ${app.ownerId}, State: ${app.state}`, // desc
    undefined
  )
}
function SelectableCalendar({ appointments, localizer, role }: SelectableCalendarProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [_appointment, setAppointment] = useState<Appointment>();
  const [rawAppointments, _setRawAppointments] = useState<Appointment[]>(appointments);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function onCloseDialog() {
    setIsDialogOpen(false);
    setSelectedEvent(undefined);
  }
  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setOpenCreateDialog(true);
    setStartTime(start);
    setEndTime(end);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const appLength = `${hours}:${minutes.toString().padStart(2, "0")}`;
    const time = start.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    setAppointment({
      time,
      appLength,
      date,
    } as Appointment);
  };
  return (
    <>
      <div>
        <strong>
          Click an event to see more info, or drag the mouse over the calendar
          to select a date/time range.
        </strong>
      </div>
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <BookAppointmentForm insideCard={true} startTime={startTime} endTime={endTime} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDialogOpen}
        onOpenChange={async (isOpen) => {
          if (!isOpen) await onCloseDialog();
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <BookAppointmentForm
            isEdit={true}
            insideCard={true}
            userRole={role}
            appointment={selectedEvent}
          />
        </DialogContent>
      </Dialog>
      <Calendar
        selectable
        localizer={localizer}
        events={rawAppointments.map(appointmentToCalendarEvent)}
        defaultView="month"
        views={allViews}
        defaultDate={new Date()}
        onSelectEvent={(event) => alert(event)}
        onSelectSlot={handleSelect}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
      />
    </>
  );
}

export default function Availability({
  appointments,
  role
}: {
  appointments: Appointment[];
  role: SalonRole | undefined
}) {
  return (
    <div style={{ height: "100vh" }}>
      <SelectableCalendar localizer={localizer} appointments={appointments} role={role} />
    </div>
  );
}
