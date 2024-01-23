import {
    createBrowserRouter,
} from "react-router-dom";
import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";
import ErrorPage from "@/components/ErrorPage.tsx";
import DashboardLayout from "@/layouts/DashboardLayout.tsx";
import DashboardPage from "@/pages/dashboard/DashboardPage.tsx";
import InventoryPage from "@/pages/dashboard/InventoryPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        ErrorBoundary: () => <ErrorPage/>
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path: "/dashboard",
        element: <DashboardLayout/>,
        children: [
            {
                path: "",
                element: <DashboardPage/>
            },
            {
                path: "inventory",
                element: <InventoryPage/>
            },
        ],
    },
]);

export default router