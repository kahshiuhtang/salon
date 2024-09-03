import { Button } from "@/components/ui/button";
import { TimePicker } from "antd";
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-react";
import { DayPicker } from "../dayPicker";
// Schema definition
const formSchema = z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(5).max(50),
    price: z.string().min(1).max(50),
    location: z.string().min(2).max(50),
    college: z.string(),
});
import dayjs from "dayjs";
const format = "HH:mm";
export default function BookAppointmentForm() {
    const user = useUser();
    if (user) {
        console.log(user);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            location: "",
            college: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values) {
            console.log(values);
        }
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
                            {/* Form Fields */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the title of your post"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a brief description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the price"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your college name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex">
                                <DayPicker />
                                <TimePicker
                                    defaultValue={dayjs("12:00", format)}
                                    use12Hours
                                    format={format}
                                    minuteStep={5}
                                    className="h-10 mt-0 flex-1 ml-2"
                                />
                            </div>
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
