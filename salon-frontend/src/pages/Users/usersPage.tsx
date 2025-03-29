"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import rrulePlugin from "@fullcalendar/rrule";
import {
    Plus,
    Search,
    Edit,
    ChevronUp,
    ChevronDown,
    Calendar,
    UserCheck,
    Book,
} from "lucide-react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { FullCalendarAppointment, SalonUser } from "@/lib/types/types";
import { useUsers } from "@/lib/hooks/useUsers";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/pages/Navbar/navbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointment } from "@/lib/hooks/useAppointment";
import { UserForm } from "@/pages/Users/userForm";
import { useAvailability } from "@/lib/hooks/useAvailability";
import { DateSelectArg, EventInput } from "@fullcalendar/core/index.js";
import BookAppointmentForm from "@/pages/BookAppointment/bookAppointmentForm";
import { getRandomString } from "@/lib/utils";
const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    comments: z.string().optional(),
    role: z.enum(["ADMIN", "USER", "MOD"]),
    color: z.string(),
    userId: z.string().optional(),
});

type SalonUserForm = z.infer<typeof userSchema>;
// TODO: refactor this page, way too large
export default function UsersPage() {
    const [users, setUsers] = useState<SalonUser[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<SalonUserForm | null>(null);
    const [isIncreaseUserPriv, setIsIncreaseUserPriv] =
        useState<boolean>(false);
    const [isDecreaseUserPriv, setIsDecreaseUserPriv] =
        useState<boolean>(false);
    const [currUserId, setCurrUserId] = useState<string>("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isAvailabiltyOpen, setIsAvailabiltyOpen] = useState(false);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [selectedUserCalendar, setSelectedUserCalendar] =
        useState<SalonUser | null>(null);
    const [selectedCalendarEvents, setSelectedCalendarEvents] = useState<
        FullCalendarAppointment[]
    >([]);
    const [currentAvailabilities, setCurrentAvailabilities] = useState<
        EventInput[]
    >([]);
    const increaseButtonRef = useRef<HTMLButtonElement | null>(null);
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "USER",
        },
    });
    const { fetchAllUsers, createClerkProfile } = useUsers();
    const { editProfile, createProfile } = useUserProfile();
    const { getAvailability } = useAvailability();
    const navigate = useNavigate();
    const { user } = useUser();
    let userId = "";
    if (user && user["id"]) userId = user.id;
    if (userId == "") navigate("/sign-in");

    async function fetchUsers() {
        try {
            const fetchedUsers = await fetchAllUsers({ userId });
            setUsers(fetchedUsers.users);
        } catch (e) {
            console.log("fetchUsers(): " + e);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    useEffect(() => {}, [currentAvailabilities]);
    const onSubmit = async (data: SalonUserForm) => {
        try {
            if (editingUser) {
                await editProfile(editingUser.userId || "", userId, {
                    ...editingUser,
                    userId: editingUser.userId ? editingUser.userId : "",
                    comments: data.comments || "",
                    color: data.color
                });
                setUsers(
                    users.map((user) =>
                        user.userId === editingUser.userId
                            ? {
                                  ...data,
                                  userId: editingUser.userId,
                                  comments: data.comments || "",
                              }
                            : user
                    )
                );
                setEditingUser(null);
                setIsEditUserOpen(false);
            } else {
                const randPassword = getRandomString(14);
                const res = await createClerkProfile({
                    firstName: data.firstName,
                    password: randPassword,
                    lastName: data.lastName,
                    email: [data.email],
                    phoneNumber: [data.phoneNumber],
                });
                if (!res || res.message != "Success" || res.userId == "") {
                    console.log("issue creating clerk profile...");
                    return;
                }
                await createProfile({
                    ...data,
                    userId: res.userId,
                    comments: data.comments || "",
                });
                setUsers([
                    ...users,
                    {
                        ...data,
                        userId: res.userId,
                        comments: data.comments || "",
                    },
                ]);
                setIsAddUserOpen(false);
            }
            form.reset();
        } catch (e) {
            console.log("onSubmit(): " + e);
        }
    };
    function onIncreasePrivClick(userId: string) {
        setCurrUserId(userId);
        setIsIncreaseUserPriv(true);
    }

    function onDecreasePrivClick(userId: string) {
        setCurrUserId(userId);
        setIsDecreaseUserPriv(true);
    }
    function handleEdit(user: SalonUserForm) {
        setEditingUser(user);
        setIsEditUserOpen(true);
    }
    function handleTimeframeSelect(selectInfo: DateSelectArg) {
        const { startStr, endStr } = selectInfo;
        console.log(new Date(startStr));
        console.log(new Date(endStr));
        //setOpen(true);
    }
    const handleRoleChange = async (userId: string, increment: number) => {
        const roles: SalonUser["role"][] = ["USER", "MOD", "ADMIN"];
        setUsers(
            users.map((user) => {
                if (user.userId === userId) {
                    const currentIndex = roles.indexOf(user.role);
                    const newIndex = Math.max(
                        0,
                        Math.min(roles.length - 1, currentIndex + increment)
                    );
                    editProfile(user.userId, userId, {
                        ...user,
                        role: roles[newIndex],
                    });
                    return { ...user, role: roles[newIndex] };
                }
                return user;
            })
        );
        if (increment > 0) {
            increaseButtonRef.current?.focus();
        } else {
            increaseButtonRef.current?.focus();
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDateSelect = (selectInfo: any) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };

    const handleEventClick = (clickInfo: any) => {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            clickInfo.event.remove();
        }
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div>
                <b>{eventInfo.timeText}</b>
            </div>
        );
    };

    const createEventId = () => {
        return String(Math.random() * 100000);
    };
    const { getAppointments, formatAppointments } = useAppointment();
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">
                        User Management
                    </h1>
                    <Card className="border-gray-200 shadow-lg">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <CardTitle className="text-2xl text-gray-700">
                                    User List
                                </CardTitle>
                                <Dialog
                                    open={isAddUserOpen}
                                    onOpenChange={() => {
                                        if (isAddUserOpen) {
                                            form.reset();
                                        }
                                        setIsAddUserOpen(!isAddUserOpen);
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            <Plus className="mr-2 h-4 w-4" />{" "}
                                            Add New User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Add New User
                                            </DialogTitle>
                                        </DialogHeader>
                                        <UserForm onSubmit={onSubmit} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex items-center space-x-2 mt-4">
                                <Search className="text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="max-w-sm"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredUsers.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No users found.
                                </p>
                            ) : (
                                <ul className="space-y-4">
                                    {filteredUsers.map(
                                        (currUser: SalonUser) => (
                                            <li
                                                key={currUser.userId}
                                                className={`p-4 rounded-lg shadow-md border ${
                                                    currUser.role === "ADMIN"
                                                        ? "bg-red-50 border-red-200"
                                                        : currUser.role ===
                                                          "MOD"
                                                        ? "bg-yellow-50 border-yellow-200"
                                                        : "bg-blue-50 border-blue-200"
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-800">
                                                            {currUser.firstName}{" "}
                                                            {currUser.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {currUser.email}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                currUser.phoneNumber
                                                            }
                                                        </p>
                                                        <p className="text-sm mt-2 text-gray-700">
                                                            {currUser.comments}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <span
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                currUser.role ===
                                                                "ADMIN"
                                                                    ? "bg-red-500 text-white"
                                                                    : currUser.role ===
                                                                      "MOD"
                                                                    ? "bg-yellow-500 text-gray-800"
                                                                    : "bg-blue-500 text-white"
                                                            }`}
                                                        >
                                                            {currUser.role}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <Dialog
                                                                open={
                                                                    isIncreaseUserPriv
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsIncreaseUserPriv(
                                                                        open
                                                                    );
                                                                }}
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        disabled={
                                                                            currUser.role ==
                                                                            "ADMIN"
                                                                        }
                                                                        ref={increaseButtonRef}
                                                                        size="icon"
                                                                        variant="outline"
                                                                        title="Increase Role Privilege"
                                                                        onClick={() => {
                                                                            onIncreasePrivClick(
                                                                                currUser.userId
                                                                            );
                                                                        }}
                                                                        aria-label="Demote user"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-md">
                                                                    <DialogHeader></DialogHeader>
                                                                    <div className="h-[100px]">
                                                                        <h2 className="mb-2">
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            promote
                                                                            this
                                                                            user?
                                                                        </h2>
                                                                        <Button
                                                                            variant="secondary"
                                                                            title="Increase Role Privilege"
                                                                            onClick={() => {
                                                                                handleRoleChange(
                                                                                    currUserId,
                                                                                    1
                                                                                );
                                                                                setIsIncreaseUserPriv(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            aria-label="Demote user"
                                                                            className=" hover:bg-gray-100 mr-2"
                                                                        >
                                                                            Promote
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => {
                                                                                setCurrUserId(
                                                                                    ""
                                                                                );
                                                                                setIsIncreaseUserPriv(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            {
                                                                <Dialog
                                                                    open={
                                                                        isDecreaseUserPriv
                                                                    }
                                                                    onOpenChange={(
                                                                        open
                                                                    ) => {
                                                                        setIsDecreaseUserPriv(
                                                                            open
                                                                        );
                                                                    }}
                                                                >
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            disabled={
                                                                                currUser.role ==
                                                                                "USER"
                                                                            }
                                                                            size="icon"
                                                                            variant="outline"
                                                                            title="Decrease Role Privilege"
                                                                            onClick={() => {
                                                                                onDecreasePrivClick(
                                                                                    currUser.userId
                                                                                );
                                                                            }}
                                                                            aria-label="Demote user"
                                                                            className="bg-white hover:bg-gray-100"
                                                                        >
                                                                            <ChevronDown className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-md">
                                                                        <DialogHeader></DialogHeader>
                                                                        <div className="h-[100px]">
                                                                            <h2 className="mb-2">
                                                                                Are
                                                                                you
                                                                                sure
                                                                                you
                                                                                want
                                                                                to
                                                                                decrease
                                                                                this
                                                                                user's
                                                                                privilege?
                                                                            </h2>
                                                                            <Button
                                                                                variant="secondary"
                                                                                title="Decrease Role Privilege"
                                                                                onClick={() => {
                                                                                    handleRoleChange(
                                                                                        currUserId,
                                                                                        -1
                                                                                    );
                                                                                    setIsDecreaseUserPriv(
                                                                                        false
                                                                                    );
                                                                                }}
                                                                                aria-label="Demote user"
                                                                                className="hover:bg-gray-100 mr-2"
                                                                            >
                                                                                Demote
                                                                            </Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                onClick={() => {
                                                                                    setCurrUserId(
                                                                                        ""
                                                                                    );
                                                                                    setIsDecreaseUserPriv(
                                                                                        false
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            }
                                                            <Dialog
                                                                open={
                                                                    isEditUserOpen
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsEditUserOpen(
                                                                        open
                                                                    );
                                                                }}
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        title="Edit User Information"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                currUser
                                                                            )
                                                                        }
                                                                        aria-label="Edit user"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Edit
                                                                            User
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                    <UserForm
                                                                        onSubmit={
                                                                            onSubmit
                                                                        }
                                                                        initialData={
                                                                            editingUser
                                                                        }
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Dialog
                                                                open={
                                                                    isAvailabiltyOpen
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsAvailabiltyOpen(
                                                                        open
                                                                    );
                                                                }}
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        title="Check Availabilities"
                                                                        onClick={async () => {
                                                                            setSelectedUserCalendar(
                                                                                currUser
                                                                            );
                                                                            setIsAvailabiltyOpen(
                                                                                true
                                                                            );
                                                                            const res =
                                                                                await getAvailability(
                                                                                    {
                                                                                        userId: currUser.userId,
                                                                                    }
                                                                                );
                                                                            setCurrentAvailabilities(
                                                                                res
                                                                            );
                                                                        }}
                                                                        aria-label="View user calendar"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <UserCheck className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            {
                                                                                selectedUserCalendar?.firstName
                                                                            }{" "}
                                                                            {
                                                                                selectedUserCalendar?.lastName
                                                                            }
                                                                            's
                                                                            Availability
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="h-[700px]">
                                                                        <FullCalendar
                                                                            plugins={[
                                                                                dayGridPlugin,
                                                                                timeGridPlugin,
                                                                                interactionPlugin,
                                                                                rrulePlugin,
                                                                            ]}
                                                                            headerToolbar={{
                                                                                left: "prev,next today",
                                                                                center: "title",
                                                                                right: "timeGridWeek,timeGridDay",
                                                                            }}
                                                                            initialView="timeGridWeek"
                                                                            editable
                                                                            selectable
                                                                            select={
                                                                                handleTimeframeSelect
                                                                            }
                                                                            selectMirror
                                                                            dayMaxEvents
                                                                            weekends
                                                                            eventClick={(
                                                                                info
                                                                            ) =>
                                                                                handleEventClick(
                                                                                    info
                                                                                )
                                                                            }
                                                                            events={
                                                                                currentAvailabilities
                                                                            }
                                                                            eventContent={
                                                                                renderEventContent
                                                                            }
                                                                            businessHours={{
                                                                                startTime:
                                                                                    "9:30",
                                                                                endTime:
                                                                                    "21:30",
                                                                            }}
                                                                            slotMinTime="7:00"
                                                                            slotMaxTime="22:00"
                                                                        />
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Dialog
                                                                open={
                                                                    isCalendarOpen
                                                                }
                                                                onOpenChange={(
                                                                    open
                                                                ) => {
                                                                    setIsCalendarOpen(
                                                                        open
                                                                    );
                                                                }}
                                                            >
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        title="View Upcoming Appointments"
                                                                        onClick={async () => {
                                                                            setSelectedUserCalendar(
                                                                                currUser
                                                                            );
                                                                            setIsCalendarOpen(
                                                                                true
                                                                            );
                                                                            const res =
                                                                                await getAppointments(
                                                                                    {
                                                                                        userId: currUser.userId,
                                                                                    }
                                                                                );
                                                                            const formatedApps =
                                                                                formatAppointments(
                                                                                    res
                                                                                );
                                                                            setSelectedCalendarEvents(
                                                                                formatedApps
                                                                            );
                                                                        }}
                                                                        aria-label="View user calendar"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <Calendar className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            {
                                                                                selectedUserCalendar?.firstName
                                                                            }{" "}
                                                                            {
                                                                                selectedUserCalendar?.lastName
                                                                            }
                                                                            's
                                                                            Calendar
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="h-[600px]">
                                                                        <FullCalendar
                                                                            plugins={[
                                                                                dayGridPlugin,
                                                                                timeGridPlugin,
                                                                                interactionPlugin,
                                                                            ]}
                                                                            headerToolbar={{
                                                                                left: "prev,next today",
                                                                                center: "title",
                                                                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                                                                            }}
                                                                            initialView="dayGridMonth"
                                                                            editable
                                                                            selectable
                                                                            selectMirror
                                                                            dayMaxEvents
                                                                            weekends
                                                                            events={
                                                                                selectedCalendarEvents
                                                                            } // You would populate this with user-specific events
                                                                            select={
                                                                                handleDateSelect
                                                                            }
                                                                            eventContent={
                                                                                renderEventContent
                                                                            }
                                                                            eventClick={
                                                                                handleEventClick
                                                                            }
                                                                            businessHours={{
                                                                                startTime:
                                                                                    "9:30",
                                                                                endTime:
                                                                                    "21:30",
                                                                            }}
                                                                            slotMinTime="7:00"
                                                                            slotMaxTime="22:00"
                                                                        />
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Dialog
                                                                open={
                                                                    isBookOpen
                                                                }
                                                                onOpenChange={
                                                                    setIsBookOpen
                                                                }
                                                            >
                                                                <DialogTrigger
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        title="Book an Appointment"
                                                                        aria-label="View user calendar"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <Book className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
                                                                    <DialogHeader>
                                                                        {/* Optional: Only include if you need title/description */}
                                                                        {/* <DialogTitle>Book Appointment</DialogTitle> */}
                                                                        {/* <DialogDescription>Select a slot to book an appointment</DialogDescription> */}
                                                                    </DialogHeader>
                                                                    <BookAppointmentForm
                                                                        insideCard
                                                                        forUser={
                                                                            currUser
                                                                        }
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
