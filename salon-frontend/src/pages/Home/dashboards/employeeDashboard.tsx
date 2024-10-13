import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyCalendarAppointment, SalonRole } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmployeeDashboardProps {
    appointments: DailyCalendarAppointment[];
    role: SalonRole;
}

export default function EmployeeDashboard({appointments, role} : EmployeeDashboardProps){
    const [selectedDate, setSelectedDate] = useState("2023-09-25");
    const [dateRange, setDateRange] = useState<Date[]>([]);

    const generateDateRange = function (date: Date) {
        const daysArray: Date[] = [];
        for (let i = -3; i <= 3; i++) {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + i);
            daysArray.push(newDate);
        }
        setDateRange(daysArray);
    };
    return  <Tabs defaultValue="calendar" className="w-full">
    <TabsList>
        <TabsTrigger value="calendar">
            Daily Calendar
        </TabsTrigger>
        <TabsTrigger value="list">
            Appointment List
        </TabsTrigger>
    </TabsList>
    <TabsContent value="calendar">
        <div className="flex justify-center space-x-4 mb-4">
            {dateRange.map((date, index) => {
                return (
                    <Button
                        key={index}
                        onClick={() =>
                            {
                                setSelectedDate(
                                    date
                                        .toISOString()
                                        .split("T")[0]
                                );
                                generateDateRange(date);
                            }
                        }
                    >
                        {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </Button>
                );
            })}
        </div>
        <DailyCalendar
            appointments={appointments}
            date={selectedDate}
        />
    </TabsContent>
    <TabsContent value="list">
        <div className="grid gap-4 md:grid-cols-2">
            {appointments.map((appointment) => (
                <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userType={role}
                    isPast={false} //TODO: fix this what should it be
                />
            ))}
        </div>
    </TabsContent>
</Tabs>
}