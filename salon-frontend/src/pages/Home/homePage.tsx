import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Paintbrush } from "lucide-react";
import Navbar from "@/pages/Navbar/navbar";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRole } from "@/lib/hooks/useRole";
import { SalonRole, DailyCalendarAppointment } from "@/lib/types/types";
import { useAppointment } from "@/lib/hooks/useAppointment";
import CustomerDashboard from "./dashboards/customerDashboard";
import EmployeeDashboard from "./dashboards/employeeDashboard";
const tempApps: DailyCalendarAppointment[] = [];
export default function HomePage() {
    const [userType, setUserType] = useState<SalonRole>("USER");
    const [role, setRole] = useState<SalonRole>("USER");
    const [firstName, setFirstName] = useState("");
    const [appointments, setAppointments] = useState(tempApps);
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
            const userRole = await getRole({ userId });
            setFirstName(name.firstName);
            setUserType(userRole);
            setRole(userRole);
        } catch (e) {
            console.log("fetchName(): " + e);
        }
    };
    const fetchRelevantAppointments = async function () {
        try {
            const apps = await getAppointments({ userId });
            const formattedApps = convertAppsForHomePage(apps);
            setAppointments(formattedApps);
        } catch (e) {
            console.log("fetchRelevantAppointments(): " + e);
        }
    };
    useEffect(() => {
        fetchNameAndRole();
    }, []);

    useEffect(() => {
        fetchRelevantAppointments();
    }, [user?.id, userType]);

    console.log(role);
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4 flex-grow">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    {role !== "USER" && (
                        <Button
                            onClick={() => setUserType(userType !== "USER" ? "USER" : "MOD")}
                        >
                            Switch to {userType !== "USER" ? "Customer" : "Employee"} View
                        </Button>
                    )}
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
                    <CustomerDashboard appointments={appointments} />
                ) : (
                    <EmployeeDashboard appointments={appointments} role={userType} />
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
                            <Link to="/book">
                                <Button>
                                    <Paintbrush className="mr-2 h-4 w-4" />
                                    Book Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
                {/* 
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
                )} */}
            </div>
        </div>
    );
}
