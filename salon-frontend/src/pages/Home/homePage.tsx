import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Paintbrush, User } from "lucide-react";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "@/lib/hooks/getUserInfo";
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
interface AppointmentCardProps {
    appointment: AppointmentCardAppProps;
    isPast: boolean | undefined;
}
export default function HomePage() {
    const [userType, setUserType] = useState("customer");
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
    const fetchName = async function(){
        try{
            const name = await getNameFromId({userId});
            setFirstName(name.firstName);
        }catch(e){
            console.log("fetchName(): " + e);
        }
    }
    useEffect(()=>{
        fetchName();
    })
    const AppointmentCard = ({
        appointment,
        isPast = false,
    }: AppointmentCardProps) => (
        <Card className="mb-4">
            <CardContent className="flex flex-col p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-semibold">
                            {appointment.services.map((s) => s.name).join(", ")}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-2 h-4 w-4" />
                            {appointment.time}
                        </div>
                    </div>
                    {!isPast && userType === "customer" && (
                        <Button variant="outline" size="sm">
                            Reschedule
                        </Button>
                    )}
                    {userType === "employee" && (
                        <Button variant="outline" size="sm">
                            View Details
                        </Button>
                    )}
                </div>
                {userType !== "customer" && (
                    <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" />
                        {appointment.client}
                    </div>
                )}
                <div className="mt-2">
                    <p className="text-sm font-semibold">Services:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {appointment.services.map((service, index) => (
                            <li key={index}>
                                {service.name} with {service.technician} (
                                {service.duration} min)
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
    interface DailyCalendarProps {
        date: string;
    }
    const DailyCalendar = ({ date }: DailyCalendarProps) => {
        const dayAppointments = appointments.filter((a) => a.date === date);
        const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

        return (
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">
                    Daily Schedule - {date}
                </h2>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="text-right pr-2">{hour}:00</div>
                            <div className="border-l pl-2 min-h-[60px]">
                                {dayAppointments
                                    .filter(
                                        (a) =>
                                            parseInt(a.time.split(":")[0]) ===
                                            hour
                                    )
                                    .map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="bg-black text-white p-1 text-sm mb-1 rounded"
                                        >
                                            {appointment.time} -{" "}
                                            {appointment.client}:{" "}
                                            {appointment.services
                                                .map((s) => s.name)
                                                .join(", ")}
                                        </div>
                                    ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button
                        onClick={() =>
                            setUserType(
                                userType === "customer"
                                    ? "employee"
                                    : "customer"
                            )
                        }
                    >
                        Switch to{" "}
                        {userType === "customer" ? "Employee" : "Customer"} View
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            Welcome, {firstName}
                        </CardTitle>
                        <CardDescription>
                            {userType === "customer"
                                ? "Here's an overview of your appointments"
                                : "Here's your schedule and upcoming appointments"}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {userType === "customer" ? (
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
                            <DailyCalendar date={selectedDate} />
                        </TabsContent>
                        <TabsContent value="list">
                            <div className="grid gap-4 md:grid-cols-2">
                                {appointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        isPast={false} //TODO: fix this what should it be
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {userType === "customer" && (
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

                {userType === "employee" && (
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
