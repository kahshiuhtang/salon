import Navbar from "@/pages/Navbar/navbar";
import UserInfoForm from "@/pages/CreateProfile/userInfoForm";
import AvailablityCalendar from "@/pages/Settings/availabilityCalendar";
import AvailabilityCard from "@/pages/Settings/availabilityCard";

export default function SettingsPage() {
    return (
        <>
            <Navbar />
            <div className="flex m-4">
                <div className="w-3/4 mr-2">
                    <AvailablityCalendar />
                </div>
                <div>
                    <UserInfoForm center={false} />
                    <AvailabilityCard />
                </div>
            </div>
        </>
    );
}
