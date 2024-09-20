import Navbar from "@/pages/Navbar/navbar";
import UserInfoForm from "@/pages/CreateProfile/userInfoForm";
import AvailablityCalendarAST from "@/pages/Settings/availabilityCalendar";

export default function SettingsPage() {
    return (
        <>
            <Navbar />
            <div className="flex m-4">
                <div className="w-3/4 mr-2">
                    <AvailablityCalendarAST />
                </div>
                <div>
                    <UserInfoForm center={false} />
                </div>
            </div>
        </>
    );
}
