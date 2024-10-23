"use client";

import Navbar from "@/pages/Navbar/navbar";
import UserInfoForm from "@/pages/CreateProfile/userInfoForm";
import AvailablityCalendar from "@/pages/Settings/availabilityCalendar";
import AvailabilityCard from "@/pages/Settings/availabilityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ListIcon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AvailabilityListView from "@/pages/Settings/listView";
import { SalonUser } from "@/lib/types/types";
import { useUser } from "@clerk/clerk-react";
import { useUsers } from "@/lib/hooks/useUsers";

export default function SettingsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<SalonUser>();
    const { user } = useUser();
    const userId = user && user.id ? user.id : "";
    const { getUserFromId } = useUsers();
    const fetchThisUser = async () => {
        try{
            if(userId == "") return;
            const thisUser = await getUserFromId({userId});
            if(!thisUser){
                return;
            }
            setUserInfo(thisUser);
        }catch(e){

        }
    }
    useEffect(() => {
        fetchThisUser();
    }, [user]);
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background p-4 sm:p-8">
                <Tabs
                    defaultValue="calendar"
                    className="w-full max-w-6xl mx-auto space-y-6"
                >
                    <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-14">
                        <TabsTrigger
                            value="calendar"
                            className="text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Calendar</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="list"
                            className="text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <ListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">List View</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="calendar" className="mt-6">
                        <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6">
                            <div className="flex justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                                    Calendar View
                                </h2>
                                <Dialog
                                    open={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button>Add Availability</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <AvailabilityCard />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <AvailablityCalendar />
                        </div>
                    </TabsContent>
                    <TabsContent value="settings" className="mt-6">
                        <UserInfoForm center={false} thisUser={userInfo}/>
                    </TabsContent>
                    <TabsContent value="list" className="mt-6">
                        <AvailabilityListView />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
