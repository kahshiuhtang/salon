import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getTranactionData } from "@/components/pages/TransactionPage";
import LoginPage from "@/components/pages/LoginPage";
import HomePage from "@/components/pages/HomePage";
import RootBoundary from "@/components/errors/RootBoundary";
import SignupPage from "@/components/pages/SignupPage";
import ServicesPage from "@/components/pages/ServicesPage";
import SettingsPage from "@/components/pages/SettingsPage";
import StaffPage from "@/components/pages/StaffPage";
import ClientsPage from "@/components/pages/ClientsPage";
import InventoryPage from "@/components/pages/InventoryPage";
import TransactionPage from "@/components/pages/TransactionPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
        errorElement: <RootBoundary />,
    },
    {
        path: "login",
        element: <LoginPage />,
        errorElement: <RootBoundary />,
    },
    {
        path: "signup",
        element: <SignupPage />,
        errorElement: <RootBoundary />,
    },
    {
        path: "transactions",
        loader: async () => {
            return getTranactionData();
        },
        element: <TransactionPage />,
    },
    {
        path: "home",
        element: <HomePage />,
    },
    {
        path: "services",
        element: <ServicesPage />,
    },
    {
        path: "clients",
        element: <ClientsPage />,
    },
    {
        path: "staff",
        element: <StaffPage />,
    },
    {
        path: "inventory",
        element: <InventoryPage />,
    },
    {
        path: "settings",
        element: <SettingsPage />,
    },
]);
function App() {
    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(7);
    const tasks = [
        { date: "2024-07-01", time: "09:00 AM", description: "Task 1" },
        { date: "2024-07-01", time: "10:00 AM", description: "Task 2" },
        { date: "2024-07-15", time: "11:00 AM", description: "Task 3" },
        { date: "2024-07-20", time: "01:00 PM", description: "Task 4" },
        // Add more tasks as needed
    ];
    function goToPreviousMonth() {
        if (month == 1) {
            setMonth(12);
            setYear(year - 1);
            return;
        }
        setMonth(month - 1);
    }
    function goToNextMonth() {
        if (month == 12) {
            setMonth(1);
            setYear(year + 1);
            return;
        }
        setMonth(month + 1);
    }
    const tasks1 = [
        {
            startTime: "09:00 AM",
            endTime: "09:30 AM",
            description: "Task 1",
            assignedEmployee: 1,
        },
        {
            startTime: "09:15 AM",
            endTime: "09:45 AM",
            description: "Task 2",
            assignedEmployee: 1,
        },
        {
            startTime: "11:00 AM",
            endTime: "11:30 AM",
            description: "Task 3",
            assignedEmployee: 2,
        },
        {
            startTime: "01:45 PM",
            endTime: "02:30 PM",
            description: "Task 4",
            assignedEmployee: 3,
        },
        // Add more tasks as needed
    ];
    // return (
    //   <>
    //     <button onClick={() => goToPreviousMonth()}>Prev Month</button>
    //     <button onClick={() => goToNextMonth()}>Next Month</button>
    //     <DaySchedule tasks={tasks1} />
    //     <Calendar year={year} month={month} tasks={tasks} />
    //   </>
    // );
    return <RouterProvider router={router} />;
}

export default App;
