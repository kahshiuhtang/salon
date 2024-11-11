"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn, groupByType } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SalonService } from "@/lib/types/types";

interface SelectServiceCompProps {
    allServices: SalonService[];
    value: string;
    onChange: (value: string) => void;
}
//TODO: integrate this into the existing forms
export default function SelectServiceComp({
    allServices,
    value,
    onChange,
}: SelectServiceCompProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {value
                        ? allServices.find((service) => service.id === value)
                              ?.name
                        : "Select service..."}
                    <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search services..."
                        className="h-9"
                    />
                    <CommandEmpty>No service found.</CommandEmpty>
                    <ScrollArea className="h-[300px]">
                        {Array.from(groupByType(allServices).entries()).map(
                            ([type, services]) => (
                                <CommandGroup key={type} heading={type}>
                                    <div className="grid grid-cols-2 gap-2 p-2">
                                        {services.map((service) => (
                                            <CommandItem
                                                key={service.id}
                                                value={service.id}
                                                onSelect={(currentValue) => {
                                                    onChange(
                                                        currentValue === value
                                                            ? ""
                                                            : currentValue
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value === service.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {service.name}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </div>
                                </CommandGroup>
                            )
                        )}
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
