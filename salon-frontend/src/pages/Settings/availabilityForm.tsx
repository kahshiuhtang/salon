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
import { useNavigate } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
const formSchema = z.object({
    date: z.date(),
    startTime: z.date(),
    endTime: z.date(),
    repeatWeekly: z.string().optional(),
    repeatDaily: z.string().optional(),
});
const timeFormat = "HH:mm";
export default function AvailabilityForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    const navigate = useNavigate();
    const { user } = useUser();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            var userId = "";
            if (user && user["id"]) userId = user.id;
            if (userId == "") return;
            console.log(values);
            navigate("/");
        } catch (e) {
            console.log(e);
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
                                    <FormLabel>Repeated Event</FormLabel>
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
                                    <FormLabel>
                                        Repeated Event (Weekly)
                                    </FormLabel>
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
