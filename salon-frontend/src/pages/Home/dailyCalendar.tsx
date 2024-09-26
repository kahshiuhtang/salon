import React from "react";
import { DailyCalendarAppointment } from "@/lib/types/types";

interface DailyCalendarProps {
  date: string;
  appointments: DailyCalendarAppointment[];
}
export default function DailyCalendar({
  date,
  appointments,
}: DailyCalendarProps) {
  const dayAppointments = appointments.filter((a) => a.date === date);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Daily Schedule - {date}</h2>
      <div className="grid grid-cols-[auto,1fr] gap-2">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-right pr-2">{hour}:00</div>
            <div className="border-l pl-2 min-h-[60px]">
              {dayAppointments
                .filter((a) => parseInt(a.time.split(":")[0]) === hour)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-black text-white p-1 text-sm mb-1 rounded"
                  >
                    {appointment.time} - {appointment.client}:{" "}
                    {appointment.services.map((s) => s.name).join(", ")}
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
