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
import {  Paintbrush } from "lucide-react";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "@/lib/hooks/getUserInfo";
import { useGetRole } from "@/lib/hooks/getRole";
import { SalonRole } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
export interface AppointmentCardAppProps {
    id: string | number;
    date: string;
    time: string;
    client: string;
    services: ACPService[];
}
export interface ACPService {
    name: string;
    duration: number;
    technician: string;
}
const appointments: AppointmentCardAppProps[] = [
    {
        id: 1,
        date: "2023-09-25",
        time: "14:00",
        client: "Alice Johnson",
        services: [
            { name: "Haircut", duration: 30, technician: "Le" },
            { name: "Color", duration: 60, technician: "Le" },
        ],
    },
    {
        id: 2,
        date: "2023-09-26",
        time: "10:30",
        client: "Bob Smith",
        services: [
            { name: "Beard Trim", duration: 15, technician: "Kim" },
            { name: "Shave", duration: 30, technician: "Kimberly" },
        ],
    },
    {
        id: 3,
        date: "2023-09-27",
        time: "11:00",
        client: "Charlie Brown",
        services: [
            { name: "Manicure", duration: 45, technician: "Kim" },
            { name: "Pedicure", duration: 45, technician: "Kim" },
        ],
    },
    {
        id: 4,
        date: "2023-09-20",
        time: "15:00",
        client: "David Wilson",
        services: [{ name: "Haircut", duration: 30, technician: "Marie" }],
    },
    {
        id: 5,
        date: "2023-09-18",
        time: "13:30",
        client: "Eva Martinez",
        services: [
            { name: "Hair Styling", duration: 45, technician: "Marie" },
            { name: "Makeup", duration: 30, technician: "Marie" },
        ],
    },
];
export default function HomePage() {
    const [userType, setUserType] = useState<SalonRole>("USER");
    const [selectedDate, setSelectedDate] = useState("2023-09-25");
    const [firstName, setFirstName] = useState("");
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

    const { getNameFromId } = useGetUserInfo();
    const { getRole } = useGetRole();
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
    useEffect(() => {
        fetchNameAndRole();
    });

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
                                <Button
                                    onClick={() =>
                                        setSelectedDate("2023-09-25")
                                    }
                                >
                                    Sep 25
                                </Button>
                                <Button
                                    onClick={() =>
                                        setSelectedDate("2023-09-26")
                                    }
                                >
                                    Sep 26
                                </Button>
                                <Button
                                    onClick={() =>
                                        setSelectedDate("2023-09-27")
                                    }
                                >
                                    Sep 27
                                </Button>
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
