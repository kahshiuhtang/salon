import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, DailyCalendarAppointment } from "@/lib/types/types";
import AppointmentCard from "@/pages/Home/appointmentCard";

interface CustomerDashboardProps {
    dailyCalendarApps: DailyCalendarAppointment[];
    appointments: Appointment[];
    deleteAppLocally: (appId: string) => boolean;
}

export default function CustomerDashboard({
    appointments,
    dailyCalendarApps,
    deleteAppLocally
}: CustomerDashboardProps) {
    const currentDate = new Date();
    const upcomingAppointments = dailyCalendarApps.filter(
        (a) => new Date(a.date) >= currentDate
    );
    const pastAppointments = dailyCalendarApps.filter(
        (a) => new Date(a.date) < currentDate
    );
    const idToApp = appointments.reduce<Record<string, Appointment>>((acc, obj: Appointment) => {
        acc[obj.id] = obj;
        return acc;
      }, {});
    return (
        <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
                <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                <TabsTrigger value="history">Appointment History</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <div className="grid gap-4 md:grid-cols-2">
                    {upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            deleteAppLocally={deleteAppLocally}
                            dailyCalendarApp={appointment}
                            appointment={idToApp[appointment.id]}
                            userType={"USER"}
                            isPast={false} //TODO: fix this what should it be
                        />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="history">
                <div className="grid gap-4 md:grid-cols-2">
                    {pastAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            deleteAppLocally={deleteAppLocally}
                            dailyCalendarApp={appointment}
                            appointment={idToApp[appointment.id]}
                            userType={"USER"}
                            isPast={true}
                        />
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}
