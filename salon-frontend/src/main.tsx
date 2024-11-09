import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/root-layout";
import BookAppointmentPage from "@/pages/BookAppointment/bookAppointmentPage";
import CalendarPage from "@/pages/Calendar/calendarPage";
import SettingsPage from "@/pages/Settings/settingsPage";
import SignInPage from "@/pages/Landing/signinPage";
import RegisterPage from "@/pages/Landing/registerPage";
import CreateProfilePage from "@/pages/CreateProfile/createProfilePage";
import RequestsPage from "@/pages/Requests/requestsPage";
import HomePage from "@/pages/Home/homePage";
import UsersPage from "@/pages/Users/usersPage";
import LandingPage from "@/pages/Landing/landingPage";
import ServicesPage from "@/pages/Services/servicesPage";
import TranscationsPage from "@/pages/Transactions/transactionsPage";
const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <LandingPage /> },
            { path: "/home", element: <HomePage /> },
            { path: "/users", element: <UsersPage /> },
            { path: "/requests", element: <RequestsPage /> },
            { path: "/book", element: <BookAppointmentPage /> },
            { path: "/create-profile", element: <CreateProfilePage /> },
            { path: "/calendar", element: <CalendarPage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/sign-in/*", element: <SignInPage /> },
            { path: "/register/*", element: <RegisterPage /> },
            { path: "/transactions", element: <TranscationsPage /> },
            { path: "/services", element: <ServicesPage /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
