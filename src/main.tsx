import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "@/routes/router.tsx";
import {Toaster} from "@/components/ui/sonner"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {DialogProvider} from 'react-dialog-promise';

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
            <DialogProvider>
                <RouterProvider router={router}/>
            </DialogProvider>
        </QueryClientProvider>
        <Toaster position={"top-center"}/>
    </React.Fragment>
)
