import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Availability, SalonRRule, SalonService } from "@/lib//types/types";

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
): SalonRRule | null {
    const { repeatTypeWeekly, repeatTypeDaily } = availability;
    const lastYear = new Date(
        startDate.setFullYear(startDate.getFullYear() - 1)
    );
    const isoString = lastYear.toISOString();
    var found = false;
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
            found = true;
            break;
        case "BIWEEKLY":
            rruleOptions.freq = "WEEKLY"; //TODO: no biweekly?
            rruleOptions.interval = 2;
            found = true;
            break;
        case "MONTHLY":
            rruleOptions.freq = "MONTHLY";
            found = true;
            break;
        default:
            break;
    }

    if (repeatTypeDaily) {
        switch (repeatTypeDaily) {
            case "ODD-WEEKDAYS":
                rruleOptions.byweekday = ["mo", "we", "fr"]; // Monday, Wednesday, Friday
                found = true;
                break;
            case "EVEN-WEEKDAYS":
                rruleOptions.byweekday = ["tu", "th"]; // Tuesday, Thursday
                found = true;
                break;
            case "WEEKEND":
                rruleOptions.byweekday = ["sa", "su"]; // Saturday, Sunday
                found = true;
                break;
            case "ODD-ALLDAYS":
                rruleOptions.bymonthday = Array.from(
                    { length: 31 },
                    (_, i) => i + 1
                ).filter((day) => day % 2 === 1); // Odd days of the month
                found = true;
                break;
            case "EVEN-ALLDAYS":
                rruleOptions.bymonthday = Array.from(
                    { length: 31 },
                    (_, i) => i + 1
                ).filter((day) => day % 2 === 0); // Even days of the month
                found = true;
                break;
            default:
                break;
        }
    }
    if (!found) {
        return null;
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

export function getDateOnlyFromDate(date: Date) {
    const month = date.getMonth() + 1; // Add 1 to get the correct month (1-12)
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
}

export function getStartAndEndDate(date: Date) {
    try {
        const resultDate = new Date(date);
        const DAYS_IN_WEEK = 7;
        const dayOfWeek = resultDate.getDay();
        if (dayOfWeek !== 0) {
            resultDate.setDate(resultDate.getDate() - dayOfWeek);
        }
        const endDate = new Date(resultDate);
        endDate.setDate(resultDate.getDate() + DAYS_IN_WEEK - 1);
        return { startDate: resultDate, endDate };
    } catch (e) {
        console.log("getStartAndEndDate(): " + e);
    }
    return { startDate: new Date(), endDate: new Date() };
}

export function getTimeOnlyFromDate(date: Date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2-digit minutes

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert '0' hour to '12'
    return `${hours}:${minutes} ${ampm}`;
}

export function convertTimeToDateObject(timeString: string) {
    const currentDate = new Date();
    const [time, period] = timeString.split(" ");

    const [hours, minutes, seconds] = time.split(":").map(Number);

    let adjustedHours = hours;
    if (period === "PM" && hours < 12) {
        adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
        adjustedHours = 0;
    }

    currentDate.setHours(adjustedHours, minutes, seconds);
    return currentDate;
}
export function groupByType(
    services: SalonService[]
): Map<string, SalonService[]> {
    const grouped = new Map<string, SalonService[]>();

    services.forEach((service) => {
        const type = service.type;
        if (!grouped.has(type)) {
            grouped.set(type, []);
        }
        grouped.get(type)?.push(service);
    });

    return grouped;
}
