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
import { Plus, Search, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { SalonUser, useUserProfile } from "@/lib/hooks/useUserProfile";
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
        }); // TODO: sloppy, should fix this
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
                      defaultValue={initialData?.firstName}
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
                      defaultValue={initialData?.phoneNumber}
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
                    defaultValue={initialData?.role || "USER"}
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <Card className="border-black">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>User List</CardTitle>
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
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New User
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
                  <li key={user.userId} className="bg-muted p-4 rounded-md">
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
                        <p className="text-sm mt-2">{user.comments}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                          {user.role}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRoleChange(user.userId, 1)}
                            aria-label="Promote user"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRoleChange(user.userId, -1)}
                            aria-label="Demote user"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={isEditUserOpen}
                            onOpenChange={setIsEditUserOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(user)}
                                aria-label="Edit user"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <UserForm
                                onSubmit={onSubmit}
                                initialData={editingUser}
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
    </>
  );
}
