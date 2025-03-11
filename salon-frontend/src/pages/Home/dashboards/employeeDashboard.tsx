import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, DailyCalendarAppointment, SalonRole } from "@/lib/types/types";
import DailyCalendar from "@/pages/Home/dailyCalendar";
import AppointmentCard from "@/pages/Home/appointmentCard";
import { useEffect, useState } from "react";
import WeeklySalonCalendar from "@/pages/Home/weeklySalonCalendar";
import { getDateOnlyFromDate } from "@/lib/utils";
import { useService } from "@/lib/hooks/useService";

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
    const [idToService, setIdToService] = useState<Map<string, string>>(new Map());
    const { getServices } = useService();
    if(!setSelectedDate) console.log("useState error"); 
    const formattedDate = getDateOnlyFromDate(new Date());
    const todayAppointments = dailyCalendarApps
        .filter(appointment => appointment.date == formattedDate) 
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

    const idToApp = appointments.reduce<Record<string, Appointment>>((acc, obj: Appointment) => {
        acc[obj.id] = obj;
        return acc;
        }, {});
    async function getServiceGoodsMappings(){
        let idMapping = new Map<string, string>();
        let services = await getServices();
        const globalMapping = services.reduce((map, service) =>{
            map.set(service.id, service.name);
            return map;
        }, new Map())
        for(const app of dailyCalendarApps){
            for(const service of app.services){
                if(idMapping.has(service.name)){
                    continue;
                }
                idMapping.set(service.name, globalMapping.get(service.name));
            }
        }
        return idMapping;
    }
    async function fetchServiceMappings(){
        try {
          const idMapping = await getServiceGoodsMappings();
          setIdToService(idMapping);
        } catch (error) {
          console.error("Error fetching service mappings:", error);
        }
      };
    useEffect(() => {
        fetchServiceMappings();
    }, []);
    useEffect(()=>{fetchServiceMappings()},[dailyCalendarApps])
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
                            idToService={idToService}
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
