import {cn} from "@/lib/utils.ts";
import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {Link, useLocation} from "react-router-dom";
import {Icon} from "@iconify/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onClick?: () => void
}


export type SidebarNavItem = {
    title: string
    icon: string
    disabled?: boolean
    external?: boolean
    href?: string
}

const menu: SidebarNavItem[] = [
    {
        title: "Dashboard",
        icon: "lucide:layout-dashboard",
        href: "/dashboard",
    },
    {
        title: "Chickens",
        icon: "fluent-emoji-high-contrast:chicken",
        href: "/dashboard/chickens",
    },

    {
        title: "Egg Production",
        icon: "lucide:egg",
        href: "/dashboard/eggs",
    },
    {
        title: "Egg Incubation",
        icon: "lucide:heater",
        href: "/dashboard/incubation",
    },
    {
        title: "Feed Formulation",
        icon: "lucide:wheat",
        href: "/dashboard/feed-formulation",
    },
    {
        title: "Configurations",
        icon: "lucide:settings",
        href: "/dashboard/configuration",
    },
]


export default function Sidebar({className, onClick}: SidebarProps) {
    const pathname = useLocation().pathname
    return (
        <div className={cn("flex h-full w-[240px] flex-col", className)}>
            <div className='flex items-center justify-center- gap-3 h-12 w-full border-b  px-4 bg-white select-none'>
                <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-6 w-6'}/>
                <Link to={'/'} className={'text-xl font-bold'}>NKHUKU</Link>
            </div>
            <div className='py-2 px-2'>
                <SidebarItems
                    pathName={pathname}
                    onClick={onClick}
                    items={menu}
                />
            </div>
        </div>
    )
}


function SidebarItems({
                          items,
                          pathName,
                          onClick,
                      }: {
    onClick?: () => void
    items: SidebarNavItem[]
    pathName: string | null
}) {
    return items.length
        ? items.map((item, index) => (
            <Button
                key={index}
                asChild
                onClick={onClick}
                variant={pathName?.includes(item.href || '') && item.href !== '/dashboard' ? "secondary" : item.href === pathName ? "secondary" : "ghost"}
                className={cn("mb-2 w-full justify-start px-3 py-2", {
                    "text-primary": item.href === pathName,
                })}
            >
                {!item.disabled && item.href ? (
                    <Link to={item.href} className={'flex w-full gap-2'}>
                        <Icon icon={item.icon} className={'h-4 w-4'}/> {item.title}
                    </Link>
                ) : (
                    <span className='flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60'>
              {item.title}
            </span>
                )}
            </Button>
        ))
        : null
}