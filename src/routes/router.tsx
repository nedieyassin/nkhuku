import {
    createBrowserRouter,
} from "react-router-dom";
import HomePage from "@/pages/home-page.tsx";
import LoginPage from "@/pages/login-page.tsx";
import RegisterPage from "@/pages/register-page.tsx";
import ErrorPage from "@/components/error-page.tsx";
import DashboardLayout from "@/layouts/dashboard-layout.tsx";
import DashboardPage from "@/pages/dashboard/dashboard-page.tsx";

// Chickens
import ChickenList from "@/pages/dashboard/chicken/list.tsx";
import ChickenAdd from "@/pages/dashboard/chicken/add.tsx";

// FeedFormulation
import FeedFormulationList from "@/pages/dashboard/feed-formulation/list.tsx";
import FeedFormulationAdd from "@/pages/dashboard/feed-formulation/add.tsx";
import FeedFormulationIngredientsList from "@/pages/dashboard/feed-formulation/ingredients/list.tsx";
import FeedFormulationIngredientsAdd from "@/pages/dashboard/feed-formulation/ingredients/add.tsx";

// Egg
import EggList from "@/pages/dashboard/egg/list.tsx";
import EggAdd from "@/pages/dashboard/egg/add.tsx";


// Incubation
import IncubationList from "@/pages/dashboard/incubation/list.tsx";
import IncubationAdd from "@/pages/dashboard/incubation/add.tsx";

// Configurations
import ConfigurationHome from "@/pages/dashboard/configuration/index.tsx";
//
import ConfigurationBreedList from "@/pages/dashboard/configuration/breed/list.tsx";
import ConfigurationBreedAdd from "@/pages/dashboard/configuration/breed/add.tsx";
//
import ConfigurationFeedList from "@/pages/dashboard/configuration/feed/list.tsx";
import ConfigurationFeedAdd from "@/pages/dashboard/configuration/feed/add.tsx";
//
import ConfigurationIncubatorList from "@/pages/dashboard/configuration/incubator/list.tsx";
import ConfigurationIncubatorAdd from "@/pages/dashboard/configuration/incubator/add.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        ErrorBoundary: () => <ErrorPage/>,
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
        ErrorBoundary: () => <ErrorPage/>,
        children: [
            {
                path: "",
                element: <DashboardPage/>
            },
            {
                path: "chickens",
                element: <ChickenList/>
            },
            {
                path: "chickens/:id",
                element: <ChickenAdd/>
            },
            {
                path: "feed-formulation",
                element: <FeedFormulationList/>
            },
            {
                path: "feed-formulation/:id",
                element: <FeedFormulationAdd/>
            },
            {
                path: "feed-formulation/:formulaId/ingredients",
                children: [
                    {
                        path: "",
                        element: <FeedFormulationIngredientsList/>
                    },
                    {
                        path: ":id",
                        element: <FeedFormulationIngredientsAdd/>
                    },
                ]
            },
            {
                path: "eggs",
                element: <EggList/>
            },
            {
                path: "eggs/:id",
                element: <EggAdd/>
            },
            {
                path: "incubation",
                element: <IncubationList/>
            },
            {
                path: "incubation/:id",
                element: <IncubationAdd/>
            },
            {
                path: "configuration",
                element: <ConfigurationHome/>,
                children: [
                    {
                        path: "breeds",
                        element: <ConfigurationBreedList/>
                    },
                    {
                        path: "breeds/:id",
                        element: <ConfigurationBreedAdd/>
                    },
                    {
                        path: "feeds",
                        element: <ConfigurationFeedList/>
                    },
                    {
                        path: "feeds/:id",
                        element: <ConfigurationFeedAdd/>
                    },
                    {
                        path: "incubators",
                        element: <ConfigurationIncubatorList/>
                    },
                    {
                        path: "incubators/:id",
                        element: <ConfigurationIncubatorAdd/>
                    },
                ]
            },
        ],
    },
]);

export default router