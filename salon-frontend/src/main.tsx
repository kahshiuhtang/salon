import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import BookAppointmentPage from "./pages/BookAppointment/bookAppointmentPage";
import CalendarPage from "./pages/Calendar/calendarPage";
import SettingsPage from "./pages/Settings/settingsPage";
import SignInPage from "./pages/Landing/signinPage";
import SignUpPage from "./pages/Landing/signupPage";
import CreateProfilePage from "./pages/CreateProfile/createProfilePage";
import MessagesPage from "./pages/Messages/messagesPage";
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
