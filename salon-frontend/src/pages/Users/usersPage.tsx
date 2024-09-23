"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Search, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { SalonUser } from "@/lib/hooks/createProfile";
import { useGetUserInfo } from "@/lib/hooks/getUserInfo";
import { useUser } from "@clerk/clerk-react";

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

    const { fetchAllUsers } = useGetUserInfo();
    const { user } = useUser();
    const fetchUsers = async function () {
        try {
            var userId = "";
            if (user && user["id"]) userId = user.id;
            if (userId == "") return;
            const fetchedUsers = await fetchAllUsers({userId});
            setUsers(fetchedUsers.users);
        } catch (e) {
            console.log("fetchUsers(): " + e);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const { register, handleSubmit, control, reset, setValue } =
        useForm<SalonUserForm>({
            resolver: zodResolver(userSchema),
            defaultValues: {
                role: "USER",
            },
        });

    const onSubmit = (data: SalonUserForm) => {
        if (editingUser) {
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
            setUsers([...users, { ...data, userId: Date.now().toString() }]);
            setIsAddUserOpen(false);
        }
        reset();
    };

    const handleEdit = (user: SalonUserForm) => {
        setEditingUser(user);
        Object.keys(user).forEach((key) => {
            setValue(
                key as keyof SalonUserForm,
                user[key as keyof SalonUserForm]
            );
        });
        setIsEditUserOpen(true);
    };

    const handleRoleChange = (userId: string, increment: number) => {
        const roles: SalonUser["role"][] = ["USER", "MOD", "ADMIN"];
        setUsers(
            users.map((user) => {
                if (user.userId === userId) {
                    const currentIndex = roles.indexOf(user.role);
                    const newIndex = Math.max(
                        0,
                        Math.min(roles.length - 1, currentIndex + increment)
                    );
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

    const UserForm = ({
        onSubmit,
        initialData = null,
    }: {
        onSubmit: (data: SalonUserForm) => void;
        initialData?: SalonUserForm | null;
    }) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        {...register("firstName")}
                        defaultValue={initialData?.firstName}
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        {...register("lastName")}
                        defaultValue={initialData?.lastName}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        defaultValue={initialData?.email}
                    />
                </div>
                <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        {...register("phoneNumber")}
                        defaultValue={initialData?.phoneNumber}
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                    id="comments"
                    {...register("comments")}
                    defaultValue={initialData?.comments}
                />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Controller
                    name="role"
                    control={control}
                    defaultValue={initialData?.role || "USER"}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MOD">Moderator</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <Button type="submit">
                {initialData ? "Update User" : "Add User"}
            </Button>
        </form>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <Card className="border-black">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>User List</CardTitle>
                        <Dialog
                            open={isAddUserOpen}
                            onOpenChange={setIsAddUserOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add New
                                    User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <UserForm onSubmit={onSubmit} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Search className="text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            No users found.
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.userId}
                                    className="bg-muted p-4 rounded-md"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.phoneNumber}
                                            </p>
                                            <p className="text-sm mt-2">
                                                {user.comments}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
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
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <Dialog
                                                    open={isEditUserOpen}
                                                    onOpenChange={
                                                        setIsEditUserOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                            aria-label="Edit user"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Edit User
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <UserForm
                                                            onSubmit={onSubmit}
                                                            initialData={
                                                                editingUser
                                                            }
                                                        />
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
    );
}
