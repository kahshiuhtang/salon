"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Appointment } from "@/lib/hooks/useAppointment";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Timestamp, deleteDoc, doc } from "firebase/firestore";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import RequestField from "./requestField";
import { useUpdateAppointmentStatus } from "@/lib/hooks/updateAppointmentStatus";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { firebaseDb } from "@/lib/firebase";
import { useGetUserInfo } from "@/lib/hooks/getUserInfo";

interface RequestCardProps {
  appointment: Appointment;
  userRole: string;
}
const timeFormat = "hh:mm a";
export default function RequestCard({
  appointment,
  userRole,
}: RequestCardProps) {
  const [currentAppState, setCurrentAppState] =
    useState<Appointment>(appointment);
  const [name, setName] = useState("");
  const appDateObject = new Date(
    (appointment.date as unknown as Timestamp).seconds * 1000
  );
  const dateString = appDateObject.toISOString().split("T")[0];
  const dateTimeString = `${dateString} ${appointment.time}`;
  const appDate = new Date(dateTimeString);
  const [date, setDate] = useState<Date>(appDate);
  const { updateAppointmentStatus } = useUpdateAppointmentStatus();
  const { toast } = useToast();
  const { getNameFromId } = useGetUserInfo();
  const getName = async function () {
    try {
      const { firstName, lastName } = await getNameFromId({
        userId: appointment.ownerId,
      });
      setName(firstName + " " + lastName);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getName();
  }, []);
  const handleApprove = async function () {
    try {
      if (appointment.state == "CONFIRMED") {
        toast({
          title: "Appointment has already been confirmed.",
        });
        return;
      }
      await updateAppointmentStatus({
        id: appointment.id,
        newStatus: "CONFIRMED",
      });
      setCurrentAppState({ ...appointment, state: "CONFIRMED" });
      toast({
        title: "Successfully Confirmed",
        description: "Appointment marked as confirmed by Salon",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error On Confirmation",
        description:
          "Unable to confirm. Please refresh the browser and try again.",
      });
    }
  };
  const handleDelete = async function () {
    try {
      const docRef = doc(firebaseDb, "appointments", appointment.id);
      await deleteDoc(docRef);
      toast({
        title: "Successfully Deleted Appointment",
        description: "Appointment has been removed for all users.",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error On Confirmation",
        description:
          "Unable to delete this appointment. Please refresh the browser and try again.",
      });
    }
  };
  if (!date) {
    setDate(date);
  }
  return (
    <>
      <Toaster />
      <Card className="w-2/3">
        <CardHeader className="pl-8 pt-8 pb-0 mb-2">
          <CardTitle>Appointment</CardTitle>
          <CardDescription>Id: {appointment.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                placeholder="Name of client"
                disabled
              />
            </div>
            <div className="flex">
              <div className="flex flex-col space-y-1.5 mr-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(" pl-3 text-left font-normal", "")}
                      disabled
                    >
                      {date ? format(appDate, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 " />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 opacity-100 bg-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={appDate}
                      disabled={(date) => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        return date < yesterday;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="-mt-1">
                <Label>Start Time</Label>
                <TimePicker
                  value={dayjs(date)}
                  defaultValue={dayjs("12:00", timeFormat)}
                  use12Hours
                  format={timeFormat}
                  minuteStep={5}
                  className="h-10"
                  disabled
                />
              </div>
            </div>
          </div>
          {currentAppState &&
            currentAppState.service1 &&
            currentAppState.tech1 && (
              <RequestField
                service={currentAppState.service1}
                technician={currentAppState.tech1}
                index={1}
              />
            )}
          {currentAppState &&
            currentAppState.service2 &&
            currentAppState.tech2 && (
              <RequestField
                service={currentAppState.service2}
                technician={currentAppState.tech2}
                index={2}
              />
            )}
          {currentAppState &&
            currentAppState.service3 &&
            currentAppState.tech3 && (
              <RequestField
                service={currentAppState.service3}
                technician={currentAppState.tech3}
                index={3}
              />
            )}
          {currentAppState &&
            currentAppState.service4 &&
            currentAppState.tech4 && (
              <RequestField
                service={currentAppState.service4}
                technician={currentAppState.tech4}
                index={4}
              />
            )}
          <div className="w-1/2">
            <Label>Current Status</Label>
            <Input
              value={
                currentAppState.state.charAt(0) +
                currentAppState.state.substring(1).toLowerCase()
              }
              disabled
            />
          </div>
          {(userRole === "ADMIN" || userRole === "MOD") && (
            <div className="mt-2">
              <Button
                className="mr-1"
                variant="secondary"
                onClick={() => {
                  handleApprove();
                }}
              >
                Approve
              </Button>
              <Button className="mr-1" variant="outline">
                Counter
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mr-1" variant="destructive">
                    Destroy
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure your want to destroy this appointment
                      request?
                    </DialogTitle>
                    <DialogDescription>
                      This will remove this appointment request for all
                      assoicated users. This action is not recoverable.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <div className="flex justify-between w-full">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => {
                            handleDelete();
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
