import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, isEndTimeBeforeStartTime } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAvailability } from "@/lib/hooks/useAvailability";
import { useNavigate } from "react-router-dom";
import { Availability, RepeatTypeDay, RepeatTypeWeek } from "@/lib/types/types";
const formSchema = z.object({
    date: z.date(),
    startTime: z.date(),
    endTime: z.date(),
    repeatWeekly: z.string().optional(),
    repeatDaily: z.string().optional(),
});
const timeFormat = "hh:mm a";
interface AvailabilityFormProps {
    availability?: Availability;
    updateAvails?: (availId: string, newAvail: Availability) => boolean; // TODO: Fix this prop drilling
}
export default function AvailabilityForm({
    availability,
    updateAvails,
}: AvailabilityFormProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const { addAvailability, updateAvailability } = useAvailability();
    const navigate = useNavigate();
    
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const startTimeString = `${today} ${availability?.startTime}`;
    const endTimeString = `${today} ${availability?.endTime}`;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startTime: availability ? new Date(startTimeString) : new Date(),
            endTime: availability ? new Date(endTimeString) : new Date(),
            date: availability ? availability.date : new Date(),
            repeatDaily: availability
                ? availability.repeatTypeDaily
                    ? availability.repeatTypeDaily
                    : ""
                : "",
            repeatWeekly: availability
                ? availability.repeatTypeWeekly
                    ? availability.repeatTypeWeekly
                    : ""
                : "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            var userId = "";
            if (user && user["id"]) userId = user.id;
            if (userId == "") navigate("/sign-in");
            if (isEndTimeBeforeStartTime(values.startTime, values.endTime)) {
                console.log("Error: End time must be after start time");
                toast({
                    title: "Error",
                    description: "End time must be after start time",
                });
                return;
            }
            const timeFormatOptions: Intl.DateTimeFormatOptions = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            const startTimeStr = values.startTime.toLocaleTimeString(
                "en-US",
                timeFormatOptions
            );
            const endTimeStr = values.endTime.toLocaleTimeString(
                "en-US",
                timeFormatOptions
            );

            if (availability) {
                await updateAvailability({
                    userId: userId,
                    availability: {
                        ...values,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        repeatDaily: values.repeatDaily as RepeatTypeDay, //TODO: how to fix this to be more clear...
                        repeatWeekly: values.repeatWeekly as RepeatTypeWeek,
                        repeat:
                            values.repeatDaily || values.repeatWeekly
                                ? true
                                : false,
                    },
                    availabilityId: availability.id,
                });
                toast({
                    title: "Edited existing availability",
                    description: `From ${startTimeStr} - ${endTimeStr}`,
                });
                if(updateAvails){
                    updateAvails(availability.id, {
                        ...values,
                        id: availability.id,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        repeatTypeDaily: values.repeatDaily as RepeatTypeDay, //TODO: how to fix this to be more clear...
                        repeatTypeWeekly: values.repeatWeekly as RepeatTypeWeek,
                        repeat:
                            values.repeatDaily || values.repeatWeekly
                                ? true
                                : false,
                    },);
                }
            } else {
                await addAvailability({
                    userId: userId,
                    availability: {
                        ...values,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        repeatDaily: values.repeatDaily as RepeatTypeDay, //TODO: how to fix this to be more clear...
                        repeatWeekly: values.repeatWeekly as RepeatTypeWeek,
                        repeat:
                            values.repeatDaily || values.repeatWeekly
                                ? true
                                : false,
                    },
                });
                toast({
                    title: "Added new availability",
                    description: `From ${startTimeStr} - ${endTimeStr}`,
                });
            }
        } catch (e) {
            console.log("onSubmit AvailabilityForm(): " + e);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className="flex">
                    <FormField
                        control={form.control}
                        name={"startTime"}
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-1/2  flex flex-col">
                                <FormLabel className="mb-2">Start</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        onChange={(time) =>
                                            field.onChange(time?.toDate())
                                        }
                                        value={dayjs(field.value)}
                                        defaultValue={dayjs(
                                            "12:00",
                                            timeFormat
                                        )}
                                        use12Hours
                                        format={timeFormat}
                                        minuteStep={5}
                                        className="h-10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"endTime"}
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-1/2 flex flex-col">
                                <FormLabel className="mb-2">End</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        onChange={(time) =>
                                            field.onChange(time?.toDate())
                                        }
                                        value={dayjs(field.value)}
                                        defaultValue={dayjs(
                                            "12:00",
                                            timeFormat
                                        )}
                                        use12Hours
                                        format={timeFormat}
                                        minuteStep={5}
                                        className="h-10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mr-2 w-full">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 " />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 opacity-100 bg-white"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => {
                                            const yesterday = new Date();
                                            yesterday.setDate(
                                                yesterday.getDate() - 1
                                            );
                                            return date < yesterday;
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex">
                    <FormField
                        control={form.control}
                        name="repeatDaily"
                        render={({ field }) => {
                            return (
                                <FormItem className="w-1/2 mr-2">
                                    <FormLabel>Daily Repeat</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select (day to day)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ODD-WEEKDAYS">
                                                Odd Weekdays
                                            </SelectItem>
                                            <SelectItem value="EVEN-WEEKDAYS">
                                                Even Weekdays
                                            </SelectItem>
                                            <SelectItem value="ODD-ALLDAYS">
                                                Odd Alldays
                                            </SelectItem>
                                            <SelectItem value="EVEN-ALLDAYS">
                                                Even Alldays
                                            </SelectItem>
                                            <SelectItem value="WEEKEND">
                                                Weekend
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="repeatWeekly"
                        render={({ field }) => {
                            return (
                                <FormItem className="w-1/2">
                                    <FormLabel>Weekly Repeat</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select (week to week)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="WEEKLY">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="BIWEEKLY">
                                                Biweekly
                                            </SelectItem>
                                            <SelectItem value="MONTHLY">
                                                Monthly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
