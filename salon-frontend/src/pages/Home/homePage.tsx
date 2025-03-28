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
import { Link, useNavigate } from "react-router-dom";
import { SalonRole, DailyCalendarAppointment, Appointment } from "@/lib/types/types";
import { useAppointment } from "@/lib/hooks/useAppointment";
import CustomerDashboard from "@/pages/Home/dashboards/customerDashboard";
import EmployeeDashboard from "@/pages/Home/dashboards/employeeDashboard";
import { Toaster } from "@/components/ui/toaster";
import { useUserContext } from "@/contexts/userContext";
export default function HomePage() {
    const { user, firstName, role } = useUserContext();
    const { getAppointments, convertAppsForHomePage } = useAppointment();
    const navigate = useNavigate();

    const [userType, setUserType] = useState<SalonRole>("USER");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [dailyCalendarApps, setDailyCalendarApps] = useState<DailyCalendarAppointment[]>([]);

    useEffect(() => {
        if (!user || !user.id) {
          navigate("/sign-in");
        }
      }, [user, navigate]);
    const userId = user?.id || "";
    async function fetchRelevantAppointments(){
        try {
            const apps = await getAppointments({ userId });
            const formattedApps = convertAppsForHomePage(apps);
            setAppointments(apps);
            setDailyCalendarApps(formattedApps);
        } catch (e) {
            console.log("fetchRelevantAppointments(): " + e);
        }
    };
    function deleteAppLocally(appId: string){
        const validApps = appointments.filter(appointment => appointment.id !== appId);
        const validDailyApps = dailyCalendarApps.filter(appointment => appointment.id !== appId);
        setAppointments(validApps);
        setDailyCalendarApps(validDailyApps);
        return true;
    }
    useEffect(() => {
        fetchRelevantAppointments();
    }, [user?.id, userType]);
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Toaster />
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
                    <CustomerDashboard deleteAppLocally={deleteAppLocally} dailyCalendarApps={dailyCalendarApps} appointments={appointments} />
                ) : (
                    <EmployeeDashboard dailyCalendarApps={dailyCalendarApps} appointments={appointments} role={userType} />
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
