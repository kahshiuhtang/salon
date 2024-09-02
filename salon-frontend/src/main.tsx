import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import CreateItemPage from "./pages/createItemPage";
import ItemsPage from "./pages/itemsPage";
import SettingsPage from "./pages/settingsPage";
import SignInPage from "./pages/signinPage";
import SignUpPage from "./pages/signupPage";
import CreateProfilePage from "./pages/createProfilePage";
import MessagesPage from "./pages/messagesPage";
import ChatPage from "./pages/activeUsers"; // Added import

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <ItemsPage /> },
            { path: "/messages", element: <MessagesPage /> },
            { path: "/create", element: <CreateItemPage /> },
            { path: "/create-profile", element: <CreateProfilePage /> },
            { path: "/items", element: <ItemsPage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/sign-in/*", element: <SignInPage /> },
            { path: "/sign-up/*", element: <SignUpPage /> },
            { path: "users", element: <ChatPage /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
