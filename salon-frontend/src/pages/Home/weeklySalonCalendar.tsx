import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import Availability from "@/pages/Calendar/calendar";
import { Appointment, FullCalendarAppointment } from "@/lib/types/types";
import { getStartAndEndDate } from "@/lib/utils";
import { useUserContext } from "@/contexts/userContext";

export default function WeeklySalonCalendar() {
  const { verifyProfile } = useUserProfile();
  const { role, user } = useUserContext();
  const { getAllSalonAppsThisWeek, formatAppointments } = useAppointment();

  const navigate = useNavigate();

  const [_currentEvents, setCurrentEvents] = useState<FullCalendarAppointment[]>(
    []
  );
  const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);

  async function fetchAppointments() {
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
  }
  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return (
    <div className="mt-4 max-w-full max-h-full">
      <h2 className="text-xl font-semibold mb-2">Weekly Salon Schedule</h2>
      <Availability appointments={rawAppointments} role={role}></Availability>
    </div>
  );
}
