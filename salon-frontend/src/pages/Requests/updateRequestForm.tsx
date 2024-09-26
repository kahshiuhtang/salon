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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const formSchema = z.object({
  time: z.date(),
  date: z.date(),
  service1: z.string().min(1, { message: "Must choose service" }),
  tech1: z.string().min(1, { message: "Must choose technician" }),
  service2: z.string(),
  tech2: z.string(),
  service3: z.string(),
  tech3: z.string(),
  service4: z.string(),
  tech4: z.string(),
});
import dayjs from "dayjs";
import { z } from "zod";
import { useAppointment } from "@/lib/hooks/useAppointment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { SelectValue } from "@radix-ui/react-select";
import { useRef } from "react";
const timeFormat = "hh:mm a";
import { Appointment } from "@/lib/hooks/useAppointment";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface UpdateRequestFormProps {
  appointment: Appointment;
}

export default function UpdateRequestForm({
  appointment,
}: UpdateRequestFormProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  if (!user || !user.id) {
    navigate("/sign-in");
  }
  const userId = user?.id || "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service1: appointment.service1,
      tech1: appointment.tech1,
      service2: appointment.service2,
      tech2: appointment.tech2,
      service3: appointment.service3,
      tech3: appointment.tech3,
      service4: appointment.service4,
      tech4: appointment.tech4,
    },
  });
  const { addAppointment } = useAppointment();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addAppointment({
      ...values,
      time: values.time.toLocaleTimeString(),
      state: "REQUESTED",
      ownerId: userId,
    });
  }
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const showMore = () => {
    for (let index = 0; index < serviceRefs.current.length; index++) {
      const div = serviceRefs.current[index];
      if (div && div.style.display === "none") {
        div.style.display = "flex";
        break;
      }
    }
  };
  const showLess = () => {
    for (let index = serviceRefs.current.length - 1; index >= 0; index--) {
      const div = serviceRefs.current[index];
      if (div && div.style.display === "flex") {
        div.style.display = "none";
        break;
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex justify-start">
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
                          !field.value && "text-muted-foreground"
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
                        yesterday.setDate(yesterday.getDate() - 1);
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
          <FormField
            control={form.control}
            name={"time"}
            render={({ field }) => (
              <FormItem className="space-y-0 w-[120px] flex flex-col">
                <FormLabel className="mb-2">Time</FormLabel>
                <FormControl>
                  <TimePicker
                    onChange={(time) => field.onChange(time?.toDate())}
                    value={dayjs(field.value)}
                    defaultValue={dayjs("12:00", timeFormat)}
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gel-mani">Gel Manicure</SelectItem>
                        <SelectItem value="gel-pedi">Gel Pedicure</SelectItem>
                      </SelectContent>
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
                <FormItem className="ml-2 flex-1">
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <div
            className="flex w-full"
            ref={(el) => (serviceRefs.current[0] = el)}
            style={{ display: "none" }}
          >
            <FormField
              control={form.control}
              name={"service2"}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gel-mani">Gel Manicure</SelectItem>
                        <SelectItem value="gel-pedi">Gel Pedicure</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"tech2"}
              render={({ field }) => (
                <FormItem className="ml-2 flex-1">
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <div
            className="flex w-full"
            ref={(el) => (serviceRefs.current[1] = el)}
            style={{ display: "none" }}
          >
            <FormField
              control={form.control}
              name={"service3"}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gel-mani">Gel Manicure</SelectItem>
                        <SelectItem value="gel-pedi">Gel Pedicure</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"tech3"}
              render={({ field }) => (
                <FormItem className="ml-2 flex-1">
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div>
            <Button type="submit">Submit</Button>
          </div>
          <div className="flex">
            <Button variant="secondary" onClick={showMore} className="mr-1">
              Add
            </Button>
            <Button variant="destructive" onClick={showLess}>
              Remove
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
