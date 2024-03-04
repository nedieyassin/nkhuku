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

import ChickenManage from "@/pages/dashboard/chicken/manage/index.tsx";
//
import ChickenManageFeedingList from "@/pages/dashboard/chicken/manage/feeding/list.tsx";
import ChickenManageFeedingAdd from "@/pages/dashboard/chicken/manage/feeding/add.tsx";
//
import ChickenManageHealthList from "@/pages/dashboard/chicken/manage/health/list.tsx";
import ChickenManageHealthAdd from "@/pages/dashboard/chicken/manage/health/add.tsx";

//
import ChickenManageMovementList from "@/pages/dashboard/chicken/manage/movement/list.tsx";
import ChickenManageMovementAdd from "@/pages/dashboard/chicken/manage/movement/add.tsx";
//
import ChickenManageMedicationList from "@/pages/dashboard/chicken/manage/medication/list.tsx";
import ChickenManageMedicationAdd from "@/pages/dashboard/chicken/manage/medication/add.tsx";

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
                path: "chickens/:chickenId/manage",
                element: <ChickenManage/>,
                children: [
                    {
                        path: "feeding",
                        element: <ChickenManageFeedingList/>
                    },
                    {
                        path: "feeding/:id",
                        element: <ChickenManageFeedingAdd/>
                    },
                    {
                        path: "health",
                        element: <ChickenManageHealthList/>
                    },
                    {
                        path: "health/:id",
                        element: <ChickenManageHealthAdd/>
                    },
                    {
                        path: "movement",
                        element: <ChickenManageMovementList/>
                    },
                    {
                        path: "movement/:id",
                        element: <ChickenManageMovementAdd/>
                    },
                    {
                        path: "medication",
                        element: <ChickenManageMedicationList/>
                    },
                    {
                        path: "medication/:id",
                        element: <ChickenManageMedicationAdd/>
                    },
                ]
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