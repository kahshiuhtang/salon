import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyCalendarAppointment } from "@/lib/types/types";
import AppointmentCard from "../appointmentCard";

interface CustomerDashboardProps {
    appointments: DailyCalendarAppointment[];
}

export default function CustomerDashboard({
    appointments,
}: CustomerDashboardProps) {
    const currentDate = new Date();
    const upcomingAppointments = appointments.filter(
        (a) => new Date(a.date) >= currentDate
    );
    const pastAppointments = appointments.filter(
        (a) => new Date(a.date) < currentDate
    );
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
                            appointment={appointment}
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
                            appointment={appointment}
                            userType={"USER"}
                            isPast={true}
                        />
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}
