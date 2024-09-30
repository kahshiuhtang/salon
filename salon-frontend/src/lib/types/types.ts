export type SalonRole = "USER" | "ADMIN" | "MOD";

export type RepeatTypeWeek = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type RepeatTypeDay = "ODD-WEEKDAYS" | "EVEN-WEEKDAYS" | "WEEKEND" | "ODD-ALLDAYS" | "EVEN-ALLDAYS"

export type AppointmentState =
    | "REQUESTED"
    | "COUNTERED-SALON"
    | "COUNTERED-USER"
    | "CONFIRMED"
    | "MISSED"
    | "RESCHEDULED"
    | "MODIFIED-USER"
    | "MODIFIED-SALON"
    | "FINISHED";
export interface Appointment {
    id: string;
    time: Date;
    length: Date;
    date: Date;
    services: ServiceRequest[];
    state: AppointmentState;
    ownerId: string;
}
export interface SalonEmployee {
    id: string;
    firstName: string;
    lastName: string;
    role: SalonRole;
}
export interface Availability {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    repeat: boolean;
    repeatTypeWeekly?: RepeatTypeWeek;
    repeatTypeDaily?: RepeatTypeDay;
}
export interface FullCalendarAppointment {
    id: string;
    title: string;
    start: string | Date; //  (required)
    end?: string | Date; //  (optional)
    allDay?: boolean; //  (optional)
    backgroundColor?: string; //  (optional)
}
export interface SalonUser {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    comments: string;
    role: "ADMIN" | "USER" | "MOD";
    userId: string;
}
export interface ACPService {
  name: string;
  duration: number;
  technician: string;
}
export interface FormattedAvailability {
    start: Date;
    end: Date;
}
export interface DailyCalendarAppointment {
  id: string | number;
  date: string;
  time: string;
  client: string;
  services: ACPService[];
}
export type SalonServiceType = "MANICURE" | "TIP SET" | "WAXING" | "PEDICURE" | "MISC";
export interface SalonService {
    id: string;
    name: string;
    type: SalonServiceType;
    price: number;
    time: number
}
export interface SalonGood{
    id: string;
    name: string;
    price: number;
    time? : number;
}
export interface ServiceRequest {
    service: string;
    tech: string;
}