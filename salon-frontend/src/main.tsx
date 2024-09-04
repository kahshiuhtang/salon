import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import BookAppointmentPage from "./pages/bookAppointmentPage";
import CalendarPage from "./pages/calendarPage";
import SettingsPage from "./pages/settingsPage";
import SignInPage from "./pages/signinPage";
import SignUpPage from "./pages/signupPage";
import CreateProfilePage from "./pages/createProfilePage";
import MessagesPage from "./pages/messagesPage";
// Import the functions you need from the SDKs you need
const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <CalendarPage /> },
            { path: "/messages", element: <MessagesPage /> },
            { path: "/book", element: <BookAppointmentPage /> },
            { path: "/create-profile", element: <CreateProfilePage /> },
            { path: "/calendar", element: <CalendarPage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/sign-in/*", element: <SignInPage /> },
            { path: "/sign-up/*", element: <SignUpPage /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
