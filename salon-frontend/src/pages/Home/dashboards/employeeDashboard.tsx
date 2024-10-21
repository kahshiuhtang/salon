import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyCalendarAppointment, SalonRole } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
import { useState } from "react";
import WeeklySalonCalendar from "@/pages/Home/weeklySalonCalendar";

interface EmployeeDashboardProps {
    appointments: DailyCalendarAppointment[];
    role: SalonRole;
}

export default function EmployeeDashboard({
    appointments,
    role,
}: EmployeeDashboardProps) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    if(!setSelectedDate) console.log("useState error"); 
    // const [dateRange, setDateRange] = useState<Date[]>([]);

    // const generateDateRange = (date: Date) => {
    //     const daysArray: Date[] = [];
    //     for (let i = -3; i <= 3; i++) {
    //         const newDate = new Date(date);
    //         newDate.setDate(date.getDate() + i);
    //         daysArray.push(newDate);
    //     }
    //     setDateRange(daysArray);
    // };

    // const moveWeek = (direction: "left" | "right") => {
    //     const firstDate = new Date(dateRange[0]);
    //     const newStartDate = new Date(firstDate);
    //     newStartDate.setDate(firstDate.getDate() + (direction === "left" ? -7 : 7));
    //     generateDateRange(newStartDate);
    // };

    // useEffect(() => {
    //     generateDateRange(new Date());
    // }, []);

    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments
        .filter(appointment => appointment.date == today) 
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 


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
                            appointment={appointment}
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
                {/* <div className="flex justify-center space-x-4 mb-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveWeek("left")}
                        aria-label="Previous week"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {dateRange.map((date, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                setSelectedDate(date.toISOString().split("T")[0]);
                                generateDateRange(date);
                            }}
                        >
                            {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveWeek("right")}
                        aria-label="Next week"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div> */}
                <WeeklySalonCalendar date={selectedDate} />
            </TabsContent>
        </Tabs>
    );
}
