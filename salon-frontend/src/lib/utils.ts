import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Availability, SalonRRule } from "@/lib//types/types";

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
export function isEndTimeBeforeStartTime(startTime: Date, endTime: Date) {
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    // Check if endTime is after startTime (based on time only)
    return (
        endHours < startHours ||
        (endHours === startHours && endMinutes <= startMinutes)
    );
}

export function generateRRule(
    availability: Availability,
    startDate: Date
): SalonRRule{
    const { repeatTypeWeekly, repeatTypeDaily } = availability;
    const lastYear = new Date(startDate.setFullYear(startDate.getFullYear() - 1));
    const isoString = lastYear.toISOString();
    const rruleOptions: SalonRRule = {
        freq: "WEEKLY", 
        interval: 1,          
        byweekday: [],
        bymonthday: [],
        dtstart: isoString,   
    };

    switch (repeatTypeWeekly) {
        case "WEEKLY":
            rruleOptions.freq = "WEEKLY";
            rruleOptions.interval = 1;
            break;
        case "BIWEEKLY":
            rruleOptions.freq = "BIWEEKLY";
            rruleOptions.interval = 2;
            break;
        case "MONTHLY":
            rruleOptions.freq = "MONTHLY";
            break;
        default:
            break;
    }

    if (repeatTypeDaily) {
        switch (repeatTypeDaily) {
            case "ODD-WEEKDAYS":
                rruleOptions.byweekday = ["mo", "we", "fr"]; // Monday, Wednesday, Friday
                break;
            case "EVEN-WEEKDAYS":
                rruleOptions.byweekday = ["tu", "th"]; // Tuesday, Thursday
                break;
            case "WEEKEND":
                rruleOptions.byweekday = ["sa", "su"]; // Saturday, Sunday
                break;
            case "ODD-ALLDAYS":
                rruleOptions.bymonthday = Array.from(
                    { length: 31 },
                    (_, i) => i + 1
                ).filter((day) => day % 2 === 1); // Odd days of the month
                break;
            case "EVEN-ALLDAYS":
                rruleOptions.bymonthday = Array.from(
                    { length: 31 },
                    (_, i) => i + 1
                ).filter((day) => day % 2 === 0); // Even days of the month
                break;
            default:
                break;
        }
    }

    return rruleOptions;
}

export function formatTimeDifference(
    startTime: string,
    endTime: string
): string {
    // Parse the time strings (assumed to be in "HH:MM" format)
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    let timeDiffMinutes = endTotalMinutes - startTotalMinutes;

    if (timeDiffMinutes < 0) {
        timeDiffMinutes += 24 * 60; // Add 24 hours (1440 minutes)
    }

    const hours = Math.floor(timeDiffMinutes / 60);
    const minutes = timeDiffMinutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
}

export function getDateOnlyFromDate(date: Date){
    console.log(date)
    const month = date.getMonth() + 1; // Add 1 to get the correct month (1-12)
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
}

export function getTimeOnlyFromDate(date: Date){
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2-digit minutes

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert '0' hour to '12'
    return `${hours}:${minutes} ${ampm}`;
}
