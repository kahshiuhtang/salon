import UnlockedNavbar from "@/pages/Navbar/unlockedNavbar";
import UserInfoForm from "@/pages/CreateProfile/userInfoForm";
export default function CreateProfilePage() {
    return (
        <div>
            <UnlockedNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <UserInfoForm center={true}/>
            </div>
        </div>
    );
}
