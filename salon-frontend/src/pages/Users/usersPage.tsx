"use client";

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Search,
    Edit,
    ChevronUp,
    ChevronDown,
    Calendar,
} from "lucide-react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { SalonUser } from "@/lib/types/types";
import { useUsers } from "@/lib/hooks/useUsers";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Navbar from "@/pages/Navbar/navbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    comments: z.string(),
    role: z.enum(["ADMIN", "USER", "MOD"]),
    userId: z.string().optional(),
});

type SalonUserForm = z.infer<typeof userSchema>;

export default function UsersPage() {
    const [users, setUsers] = useState<SalonUser[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<SalonUserForm | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedUserCalendar, setSelectedUserCalendar] =
        useState<SalonUser | null>(null);

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "USER",
        },
    });
    const { fetchAllUsers } = useUsers();
    const { createProfile, editProfile } = useUserProfile();
    const navigate = useNavigate();
    const { user } = useUser();
    var userId = "";
    if (user && user["id"]) userId = user.id;
    if (userId == "") navigate("/sign-in");

    const fetchUsers = async function () {
        try {
            const fetchedUsers = await fetchAllUsers({ userId });
            setUsers(fetchedUsers.users);
        } catch (e) {
            console.log("fetchUsers(): " + e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onSubmit = async (data: SalonUserForm) => {
        try {
            if (editingUser) {
                await editProfile(editingUser.userId || "", userId, {
                    ...editingUser,
                    userId: editingUser.userId ? editingUser.userId : "",
                });
                setUsers(
                    users.map((user) =>
                        user.userId === editingUser.userId
                            ? { ...data, userId: editingUser.userId }
                            : user
                    )
                );
                setEditingUser(null);
                setIsEditUserOpen(false);
            } else {
                const tempUserId = "TEMP" + data.email + data.phoneNumber;
                await createProfile({ ...data, userId: tempUserId });
                setUsers([...users, { ...data, userId: tempUserId }]);
                setIsAddUserOpen(false);
            }
            form.reset();
        } catch (e) {
            console.log("onSubmit(): " + e);
        }
    };

    const handleEdit = (user: SalonUserForm) => {
        setEditingUser(user);
        setIsEditUserOpen(true);
    };

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
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    };

    const createEventId = () => {
        return String(Math.random() * 100000);
    };

    const UserForm = ({
        onSubmit,
        initialData = null,
    }: {
        onSubmit: (data: SalonUserForm) => void;
        initialData?: SalonUserForm | null;
    }) => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="flex-1 pr-2">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={
                                                initialData?.firstName
                                            }
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="flex-1 pr-2">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={initialData?.lastName}
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex-1 pr-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={initialData?.email}
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="flex-1 pr-2">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={
                                                initialData?.phoneNumber
                                            }
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                            <FormItem className="flex-1 pr-2">
                                <FormLabel>Comments</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        {...field}
                                        defaultValue={initialData?.comments}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={
                                            initialData?.role || "USER"
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">
                                                User
                                            </SelectItem>
                                            <SelectItem value="MOD">
                                                Moderator
                                            </SelectItem>
                                            <SelectItem value="ADMIN">
                                                Admin
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">
                    {initialData ? "Update User" : "Add User"}
                </Button>
            </form>
        </Form>
    );

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
                                    {filteredUsers.map((user) => (
                                        <li
                                            key={user.userId}
                                            className={`p-4 rounded-lg shadow-md border ${
                                                user.role === "ADMIN"
                                                    ? "bg-red-50 border-red-200"
                                                    : user.role === "MOD"
                                                    ? "bg-yellow-50 border-yellow-200"
                                                    : "bg-blue-50 border-blue-200"
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {user.phoneNumber}
                                                    </p>
                                                    <p className="text-sm mt-2 text-gray-700">
                                                        {user.comments}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <span
                                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                            user.role ===
                                                            "ADMIN"
                                                                ? "bg-red-500 text-white"
                                                                : user.role ===
                                                                  "MOD"
                                                                ? "bg-yellow-500 text-gray-800"
                                                                : "bg-blue-500 text-white"
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user.userId,
                                                                    1
                                                                )
                                                            }
                                                            aria-label="Promote user"
                                                            className="bg-white hover:bg-gray-100"
                                                        >
                                                            <ChevronUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user.userId,
                                                                    -1
                                                                )
                                                            }
                                                            aria-label="Demote user"
                                                            className="bg-white hover:bg-gray-100"
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                        <Dialog
                                                            open={
                                                                isEditUserOpen
                                                            }
                                                            onOpenChange={
                                                                setIsEditUserOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            user
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
                                                                isCalendarOpen
                                                            }
                                                            onOpenChange={
                                                                setIsCalendarOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedUserCalendar(
                                                                            user
                                                                        );
                                                                        setIsCalendarOpen(
                                                                            true
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
                                                                            user.firstName
                                                                        }{" "}
                                                                        {
                                                                            user.lastName
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
                                                                        events={[]} // You would populate this with user-specific events
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
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
