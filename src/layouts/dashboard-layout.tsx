import {Outlet} from "react-router-dom";
import Sidebar from "@/components/sidebar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useState} from "react";
// import CommandMenu from "@/components/command-menu.tsx";
import MobileSidebar from "@/components/mobile-sidebar.tsx";
import {cn} from "@/lib/utils.ts";
import AppbarActions from "@/components/appbar-actions.tsx";
import useStore from "@/state";

export default function DashboardLayout() {
    const [open, setOpen] = useState(false)
    const {currentUser} = useStore((state) => state);
    return (
        <main className={'flex min-h-screen'}>
            <div>
                <div
                    className={cn(
                        "fixed right-0 top-0 z-50 flex h-12 w-full items-center justify-between border-b bg-background px-2 md:px-2 md:w-[calc(100%-240px)]",
                    )}
                >
                    <div className='flex items-center gap-1'>
                        <Button
                            variant='ghost'
                            className='md:hidden'
                            size='icon'
                            onClick={() => setOpen(true)}
                        >
                            <Icon icon={'lucide:menu'} className={'h-6 w-6'}/>
                        </Button>
                        <div className={'px-2 text-xl font-bold'}>
                            {currentUser?.farmName}
                        </div>
                        {/*<CommandMenu/>*/}
                    </div>

                    <div className='flex items-center gap-4'>
                        <AppbarActions/>
                    </div>
                </div>
                <MobileSidebar open={open} onOpenChange={setOpen}/>
            </div>
            <Sidebar className='fixed hidden border-r md:flex'/>
            <div className='px-3 mt-16 pb-8 md:pl-[256px] w-full'>
                <Outlet/>
            </div>
        </main>
    )
}