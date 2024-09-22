"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
interface RequestFieldProps {
    service: string;
    technician: string;
    index: number;
}
export default function RequestField({
    service,
    technician,
    index,
}: RequestFieldProps) {
    return (
        <div>
            <Label>Request {index}</Label>
            <div className="flex w-full">
                <Select defaultValue={service}>
                    <SelectTrigger className="w-full">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gel-mani">Gel Manicure</SelectItem>
                        <SelectItem value="gel-pedi">Gel Pedicure</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue={technician}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lee">Lee</SelectItem>
                        <SelectItem value="kim">Kim</SelectItem>
                        <SelectItem value="kimberly">Kimberly</SelectItem>
                        <SelectItem value="marie">Marie</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
