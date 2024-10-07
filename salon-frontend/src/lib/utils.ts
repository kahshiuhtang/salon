import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Availability } from "@/lib//types/types";
import { RRule, Options } from "rrule";

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
): RRule {
    const { repeatTypeWeekly, repeatTypeDaily } = availability;
    if (!availability.repeat)
        return new RRule({
            dtstart: startDate,
        } as Options);
    const rruleOptions: Partial<Options> = {};

    switch (repeatTypeWeekly) {
        case "WEEKLY":
            rruleOptions.freq = RRule.WEEKLY;
            rruleOptions.interval = 1;
            break;
        case "BIWEEKLY":
            rruleOptions.freq = RRule.WEEKLY;
            rruleOptions.interval = 2;
            break;
        case "MONTHLY":
            rruleOptions.freq = RRule.MONTHLY;
            break;
        default:
            break;
    }

    if (repeatTypeDaily) {
        switch (repeatTypeDaily) {
            case "ODD-WEEKDAYS":
                rruleOptions.byweekday = [RRule.MO, RRule.WE, RRule.FR]; // Monday, Wednesday, Friday
                break;
            case "EVEN-WEEKDAYS":
                rruleOptions.byweekday = [RRule.TU, RRule.TH]; // Tuesday, Thursday
                break;
            case "WEEKEND":
                rruleOptions.byweekday = [RRule.SA, RRule.SU]; // Saturday, Sunday
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

    return new RRule({
        ...rruleOptions,
        dtstart: startDate, // dtstart must be passed directly here
    } as Options);
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
