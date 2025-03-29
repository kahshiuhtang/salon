import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, DailyCalendarAppointment, SalonRole } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
import { useState } from "react";
import WeeklySalonCalendar from "@/pages/Home/weeklySalonCalendar";
import { getDateOnlyFromDate } from "@/lib/utils";

interface EmployeeDashboardProps {
    dailyCalendarApps: DailyCalendarAppointment[];
    appointments: Appointment[];
    role: SalonRole;
}

export default function EmployeeDashboard({
    appointments,
    dailyCalendarApps,
    role,
}: EmployeeDashboardProps) {
    const [_, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    if(!setSelectedDate)
        console.log("useState error"); 
    const formattedDate = getDateOnlyFromDate(new Date());
    const todayAppointments = dailyCalendarApps
        .filter(appointment => appointment.date == formattedDate) 
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

    const idToApp = appointments.reduce<Record<string, Appointment>>((acc, obj: Appointment) => {
        acc[obj.id] = obj;
        return acc;
        }, {});
    return (
        <Tabs defaultValue="today" className="w-full">
            <TabsList>
                <TabsTrigger value="today">Today's Calendar</TabsTrigger>
                <TabsTrigger value="my-appointments">My Appointments</TabsTrigger>
                <TabsTrigger value="all-appointments">
                    All Salon Appointments
                </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="max-w-full max-h-full">
                <DailyCalendar
                    date={new Date().toISOString().split("T")[0]}
                />
            </TabsContent>

            <TabsContent value="my-appointments">
                <div className="grid gap-4 md:grid-cols-2">
                    {todayAppointments.length > 0 && todayAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            dailyCalendarApp={appointment}
                            appointment={idToApp[appointment.id]}
                            userType={role}
                            isPast={new Date(appointment.date) < new Date()}
                        />
                    ))}
                    {
                        todayAppointments.length == 0 && <div>No Appointments Today</div>
                    }
                </div>
            </TabsContent>

            <TabsContent value="all-appointments">
                <WeeklySalonCalendar />
            </TabsContent>
        </Tabs>
    );
}
