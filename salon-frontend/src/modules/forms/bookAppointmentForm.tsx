"use client";
import { Button } from "@/components/ui/button";
import { TimePicker } from "antd";
import { format } from "date-fns";
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
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const formSchema = z.object({
    time: z.date({
        required_error: "Date of appointment is required",
    }),
    date: z.date(),
    service1: z.string().min(2).max(50),
    tech1: z.string().min(2).max(50),
    service2: z.string(),
    tech2: z.string(),
    service3: z.string(),
    tech3: z.string(),
    service4: z.string(),
    tech4: z.string(),
});
import dayjs from "dayjs";
import { z } from "zod";
import { useAddAppointment } from "./hooks/addAppointment";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
const timeFormat = "HH:mm";

export default function BookAppointmentForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service1: "",
            tech1: "",
            service2: "",
            tech2: "",
            service3: "",
            tech3: "",
            service4: "",
            tech4: "",
        },
    });
    const { addAppointment } = useAddAppointment();
    async function handleSubmitClick(e: any) {
        console.log(e);
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        addAppointment(values);
    }

    return (
        <div className="flex justify-center items-center mt-24">
            <Card className="w-1/4">
                <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                    <CardTitle>Book an appointment</CardTitle>
                    <CardDescription>
                        Send a request for an appointment
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <div>
                                <div className="flex w-full">
                                    <FormField
                                        control={form.control}
                                        name={"service1"}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Service</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full"></SelectTrigger>
                                                        <SelectContent></SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={"tech1"}
                                        render={({ field }) => (
                                            <FormItem className="ml-2">
                                                <FormLabel>Employee</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[180px]"></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="lee">
                                                                Lee
                                                            </SelectItem>
                                                            <SelectItem value="kim">
                                                                Kim
                                                            </SelectItem>
                                                            <SelectItem value="kimberly">
                                                                Kimberly
                                                            </SelectItem>
                                                            <SelectItem value="marie">
                                                                Marie
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
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
                                                                format(
                                                                    field.value,
                                                                    "PPP"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 " />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) => {
                                                            const yesterday =
                                                                new Date();
                                                            yesterday.setDate(
                                                                yesterday.getDate() -
                                                                    1
                                                            );
                                                            return (
                                                                date < yesterday
                                                            );
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"time"}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    onChange={field.onChange}
                                                    value={dayjs(field.value)}
                                                    defaultValue={dayjs(
                                                        "12:00",
                                                        timeFormat
                                                    )}
                                                    use12Hours
                                                    format={timeFormat}
                                                    minuteStep={5}
                                                    className="h-10  flex-1"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" onClick={handleSubmitClick}>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
