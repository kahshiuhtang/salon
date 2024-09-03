import Navbar from "@/modules/navbar";
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
import UserInfoForm from "@/modules/forms/userInfoForm";

export default function SettingsPage() {
    return (
        <>
            <Navbar />
            <UserInfoForm />
        </>
    );
}
