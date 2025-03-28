export type SalonRole = "USER" | "ADMIN" | "MOD";

export type RepeatTypeWeek = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "";
export type RepeatTypeDay =
    | "ODD-WEEKDAYS"
    | "EVEN-WEEKDAYS"
    | "WEEKEND"
    | "ODD-ALLDAYS"
    | "EVEN-ALLDAYS"
    | "";

export type AppointmentState =
    | "REQUESTED"
    | "COUNTERED-SALON"
    | "CONFIRMED"
    | "MISSED"
    | "RESCHEDULED"
    | "MODIFIED-USER"
    | "MODIFIED-SALON"
    | "FINISHED";
export interface Appointment {
    id: string;
    time: string;
    appLength: string;
    date: Date;
    services: ServiceRequest[];
    involvedEmployees: string[];
    state: AppointmentState;
    ownerId: string;
    hasTransaction: boolean;
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
export interface SalonRRule {
    freq?: string;
    interval?: number;
    byweekday?: string[];
    bymonthday?: number[];
    dtstart: string;
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
    duration?: number;
    technician: string;
}
export type FormattedAvailability = FormattedAvailability1 | FormattedAvailability2;
export interface FormattedAvailability1 {
    id: string;
    title: string;
    duration: string;
    rrule: SalonRRule;
}
export interface FormattedAvailability2 {
    title: string;
    start: string;
    end?: string;
    id?: string;
    allDay?: boolean;
  }
export interface DailyCalendarAppointment {
    id: string | number;
    date: string;
    time: string;
    client: string;
    services: ACPService[];
}
export type SalonServiceType =
    | "MANICURE"
    | "TIP SET"
    | "WAXING"
    | "PEDICURE"
    | "MISC";
export interface SalonService {
    id: string;
    name: string;
    type: SalonServiceType;
    price: number;
    time: number;
}
export interface SalonGood {
    id: string;
    name: string;
    price: number;
    time?: number;
}
export interface ServiceRequest {
    service: string;
    tech: string;
}

export interface SalonName {
    firstName: string;
    lastName: string;
}
export interface SalonNotification {
    id: string;
    title: string;
    description: string;
    senderId: string;
    type: string;
    dateSent: Date;
    seen: boolean;
}
export interface AppointmentWithClientName extends Appointment {
    clientName: string;
}

export interface SalonTransaction extends Omit<Appointment, "state" | "ownerId"> {
    transId: string;
    dateTransCreated: Date;
    totalCost: number;
    tip: number;
    taxRate: number;
    total: number;
}
