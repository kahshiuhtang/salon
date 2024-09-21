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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    startTime: z.string(),
    endTime: z.string(),
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
        <div className="w-full mt-2">
            <Card className={"w-full"}>
                <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                    <CardTitle>Create Availability Block</CardTitle>
                    <CardDescription>
                        Enter a block of time where you are usually free for future scheduling and appointments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name={"startTime"}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0 w-1/2  flex flex-col">
                                            <FormLabel className="mb-2">
                                                Time
                                            </FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    onChange={(time) =>
                                                        field.onChange(
                                                            time?.toDate()
                                                        )
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
                                            <FormLabel className="mb-2">
                                                Time
                                            </FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    onChange={(time) =>
                                                        field.onChange(
                                                            time?.toDate()
                                                        )
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
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col mr-2">
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
                                                    className="w-auto p-0 opacity-100 bg-white"
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
                                <div className="mt-5">
                                    <Button type="submit">Submit</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
