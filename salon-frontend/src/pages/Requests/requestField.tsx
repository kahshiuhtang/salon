"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { groupByType } from "@/lib/utils";
import { SalonService } from "@/lib/types/types";
interface RequestFieldProps {
    service: string;
    technician: string;
    index: number;
    allServices: SalonService[];
    disableInputs?: boolean;
}
export default function RequestField({
    service,
    technician,
    index,
    allServices,
    disableInputs = false,
}: RequestFieldProps) {
    return (
        <div>
            <Label>Request {index}</Label>
            <div className="flex w-full">
                <Select defaultValue={service} disabled={disableInputs}>
                    <SelectTrigger className="w-full">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from(groupByType(allServices).entries()).map(
                            ([type, services]) => (
                                <SelectGroup key={type}>
                                    <SelectLabel>{type}</SelectLabel>
                                    {services.map((service) => (
                                        <SelectItem
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )
                        )}
                    </SelectContent>
                </Select>
                <Select defaultValue={technician} disabled={disableInputs}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue>{technician}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={technician}>{technician}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
