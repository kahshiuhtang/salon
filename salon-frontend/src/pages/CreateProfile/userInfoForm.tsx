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
import { Input } from "@/components/ui/input";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SalonUser } from "@/lib/types/types";
import { useToast } from "@/hooks/use-toast";

interface UserInfoFormProps {
    center: boolean;
    thisUser?: SalonUser;
}

const formSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phoneNumber: z.string().min(5).max(50),
    email: z.string().min(2).max(50),
    comments: z.string(),
});
export default function UserInfoForm({ center, thisUser }: UserInfoFormProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const { createProfile, editProfile } = useUserProfile();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: thisUser && thisUser.firstName ? thisUser.firstName : "",
            lastName: thisUser && thisUser.lastName ? thisUser.lastName : "",
            phoneNumber:
                thisUser && thisUser.phoneNumber ? thisUser.phoneNumber : "",
            email: thisUser && thisUser.email ? thisUser.email : "",
            comments: thisUser && thisUser.comments ? thisUser.comments : "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            var userId = "";
            if (user && user["id"]) userId = user.id;
            if (userId == "") return;
            if (!thisUser) {
                await createProfile({ ...values, role: "USER", userId });
                navigate("/");
            } else {
                await editProfile(thisUser.userId, userId, {
                    ...values,
                    role: thisUser.role,
                    userId: thisUser.userId,
                });
                toast({
                    title: "Updated your profile.",
                    description: "Your new profile has been saved.",
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <>
            <div
                className={
                    center
                        ? "flex justify-center items-center mt-28 w-full"
                        : "w-full"
                }
            >
                <Card
                    className={
                        center
                            ? "w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
                            : ""
                    }
                >
                    <CardHeader className="pl-8 pt-8 pb-0 mb-2">
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>
                            Enter information for others to understand to see
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-2"
                            >
                                <div className="flex w-full">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1 pr-2">
                                                <FormLabel>
                                                    First Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="comments"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder=""
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full"></div>
                                <Button type="submit">
                                    {thisUser ? "Edit" : "Submit"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
