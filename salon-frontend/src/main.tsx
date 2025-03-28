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
import UserProvider from "@/contexts/userContext";
const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <LandingPage /> },
            {
                path: "/home",
                element: (
                    <UserProvider>
                        <HomePage />
                    </UserProvider>
                ),
            },
            {
                path: "/users",
                element: (
                    <UserProvider>
                        <UsersPage />
                    </UserProvider>
                ),
            },
            {
                path: "/requests",
                element: (
                    <UserProvider>
                        <RequestsPage />{" "}
                    </UserProvider>
                ),
            },
            {
                path: "/book",
                element: (
                    <UserProvider>
                        <BookAppointmentPage />
                    </UserProvider>
                ),
            },
            {
                path: "/create-profile",
                element: (
                    <UserProvider>
                        <CreateProfilePage />{" "}
                    </UserProvider>
                ),
            },
            {
                path: "/calendar",
                element: (
                    <UserProvider>
                        <CalendarPage />
                    </UserProvider>
                ),
            },
            {
                path: "/settings",
                element: (
                    <UserProvider>
                        <SettingsPage />
                    </UserProvider>
                ),
            },
            { path: "/sign-in/*", element: <SignInPage /> },
            { path: "/register/*", element: <RegisterPage /> },
            {
                path: "/transactions",
                element: (
                    <UserProvider>
                        <TranscationsPage />{" "}
                    </UserProvider>
                ),
            },
            {
                path: "/services",
                element: (
                    <UserProvider>
                        <ServicesPage />
                    </UserProvider>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
