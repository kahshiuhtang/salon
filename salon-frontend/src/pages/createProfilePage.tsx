import UnlockedNavbar from "@/modules/unlocked-navbar";
import UserInfoForm from "@/modules/forms/userInfoForm";
export default function CreateProfilePage() {
    return (
        <div>
            <UnlockedNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <UserInfoForm />
            </div>
        </div>
    );
}
