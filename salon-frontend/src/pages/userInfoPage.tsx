import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

const UserInfoPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user } = useUser();
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        if (user && userId) {
            fetchUser(userId);
        }
    }, [user, userId]);

    const fetchUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Info</h1>
            <p>
                <b>Name:</b> {userInfo.name}
            </p>
        </div>
    );
};

export default UserInfoPage;
