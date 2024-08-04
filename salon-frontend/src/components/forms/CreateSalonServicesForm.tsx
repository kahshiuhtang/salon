import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CreateSalonServicesForm() {
    const formSchema = z.object({
        service: z.string().min(2).max(50),
        description: z.string().min(6).max(150),
        time: z.string().min(6).max(50),
        cost: z
            .number({
                required_error: "required field",
                invalid_type_error: "Cost is required",
            })
            .min(0),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service: "",
            description: "",
            time: "",
        },
    });
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }
    return (
        <Card className="w-[450px]">
            <CardHeader>
                <CardTitle>Create Service</CardTitle>
                <CardDescription>
                    Enter information about offered services
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name of service"
                                            {...field}
                                        />
                                    </FormControl>
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
                                            placeholder="additional notes on service"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex">
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem className="basis-1/2 mr-1">
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="estimated time for completion"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem className="basis-1/2">
                                        <FormLabel>Cost</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="usual cost"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center"></CardFooter>
        </Card>
    );
}
