import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush } from "lucide-react";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRole } from "@/lib/hooks/useRole";
import { SalonRole, DailyCalendarAppointment } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
import { useAppointment } from "@/lib/hooks/useAppointment";
const tempApps: DailyCalendarAppointment[] = [];
export default function HomePage() {
    const [userType, setUserType] = useState<SalonRole>("USER");
    const [selectedDate, setSelectedDate] = useState("2023-09-25");
    const [dateRange, setDateRange] = useState<Date[]>([]);
    const [firstName, setFirstName] = useState("");
    const [appointments, setAppointments] = useState(tempApps);
    const currentDate = new Date();
    const upcomingAppointments = appointments.filter(
        (a) => new Date(a.date) >= currentDate
    );
    const pastAppointments = appointments.filter(
        (a) => new Date(a.date) < currentDate
    );
    const { user } = useUser();
    const navigate = useNavigate();
    if (!user || !user.id) {
        navigate("/sign-in");
    }
    const userId = user?.id || "";

    const { getNameFromId } = useUsers();
    const { getAppointments, convertAppsForHomePage } = useAppointment();
    const { getRole } = useRole();
    const fetchNameAndRole = async function () {
        try {
            const name = await getNameFromId({ userId });
            const role = await getRole({ userId });
            setFirstName(name.firstName);
            setUserType(role);
        } catch (e) {
            console.log("fetchName(): " + e);
        }
    };
    const fetchRelevantAppointments = async function () {
        try {
            const apps = await getAppointments({ userId });
            const formattedApps = convertAppsForHomePage(apps);
            console.log(formattedApps);
            setAppointments(formattedApps);
        } catch (e) {
            console.log("fetchRelevantAppointments(): " + e);
        }
    };
    useEffect(() => {
        fetchNameAndRole();
        generateDateRange(new Date());
    }, []);

    useEffect(() => {
        fetchRelevantAppointments();
    }, [user?.id]);

    const generateDateRange = function (date: Date) {
        const daysArray: Date[] = [];

        for (let i = -3; i <= 3; i++) {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + i);
            daysArray.push(newDate);
            // daysArray.push(newDate.toISOString().split("T")[0]);
        }
        setDateRange(daysArray);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button
                        onClick={() =>
                            setUserType(userType !== "USER" ? "USER" : "MOD")
                        }
                    >
                        Switch to{" "}
                        {userType !== "USER" ? "Employee" : "Customer"} View
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Welcome, {firstName}</CardTitle>
                        <CardDescription>
                            {userType === "USER"
                                ? "Here's an overview of your appointments"
                                : "Here's your schedule and upcoming appointments"}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {userType === "USER" ? (
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList>
                            <TabsTrigger value="upcoming">
                                Upcoming Appointments
                            </TabsTrigger>
                            <TabsTrigger value="history">
                                Appointment History
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                            <div className="grid gap-4 md:grid-cols-2">
                                {upcomingAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        userType={userType}
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
                                        userType={userType}
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <Tabs defaultValue="calendar" className="w-full">
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
                                        userType={userType}
                                        isPast={false} //TODO: fix this what should it be
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {userType === "USER" && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Book a New Appointment</CardTitle>
                            <CardDescription>
                                Choose from our range of nail services
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button>
                                <Paintbrush className="mr-2 h-4 w-4" />
                                Book Now
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {userType === "USER" && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Daily Summary</CardTitle>
                            <CardDescription>
                                Your performance and upcoming tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Total Appointments Today:{" "}
                                {
                                    appointments.filter(
                                        (a) => a.date === selectedDate
                                    ).length
                                }
                            </p>
                            <p>Available Slots: 3</p>
                            <Button className="mt-4">View Full Schedule</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
