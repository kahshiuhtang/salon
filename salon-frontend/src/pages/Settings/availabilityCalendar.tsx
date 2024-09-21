import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useUser } from "@clerk/clerk-react";
import { useVerifyUserProfile } from "@/lib/hooks/verifyUserProfile";
import { useNavigate } from "react-router-dom";
import {
    FormattedAvailability,
    useGetAvailability,
} from "@/lib/hooks/getCurrentAvailabilities";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { CopyIcon } from "lucide-react";
export default function AvailablityCalendarAST() {
    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        FormattedAvailability[]
    >([]);
    const [open, setOpen] = useState(false);
    function handleTimeframeSelect(selectInfo: DateSelectArg) {
        const { startStr, endStr } = selectInfo;
        console.log(new Date(startStr));
        console.log(new Date(endStr));
        setOpen(true);
    }
    const navigate = useNavigate();
    const { user } = useUser();
    const { getAvailability } = useGetAvailability();
    const { verifyUser } = useVerifyUserProfile();
    const fetchUserAvailability = async () => {
        try {
            console.log("fetching data...");
            if (user == null || user == undefined || user["id"] == null) {
                console.log("No user id");
                return;
            }
            const userId = user["id"];
            const isVerified = await verifyUser({ userId });
            if (!isVerified) {
                navigate("/create-profile");
                return;
            }
            const avails = await getAvailability({ userId });
            setCurrentAvailabilities(avails);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    const hasFetched = useRef(false);
    useEffect(() => {
        if (!hasFetched.current && user) {
            fetchUserAvailability();
            hasFetched.current = true;
        }
    }, [user]);
    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                editable
                selectable
                select={handleTimeframeSelect}
                selectMirror
                dayMaxEvents
                weekends
                events={currentAvailabilities}
                eventContent={renderEventContent}
                businessHours={{
                    startTime: "9:30",
                    endTime: "21:30",
                }}
                slotMinTime="7:00"
                slotMaxTime="22:00"
            />
            <Dialog open={open}>
                <DialogTrigger asChild>
                    <Button variant="outline">Share</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                            Anyone who has this link will be able to view this.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue="https://ui.shadcn.com/docs/installation"
                                readOnly
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3">
                            <span className="sr-only">Copy</span>
                            <CopyIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
