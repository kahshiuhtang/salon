import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDayOfWeek(date: Date) {
    const dayOfWeek = date.getDay();
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const dayName = daysOfWeek[dayOfWeek];
    return dayName;
}

// only compares the date between two Date objects, actual date has no bearing
export function isEndTimeBeforeStartTime(startTime: Date, endTime: Date){
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    // Check if endTime is after startTime (based on time only)
    return endHours < startHours ||
    (endHours === startHours && endMinutes <= startMinutes);
}
