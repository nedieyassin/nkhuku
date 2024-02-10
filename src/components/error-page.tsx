import {Link, useRouteError,} from "react-router-dom";
import {Icon} from "@iconify/react";
import {buttonVariants} from "@/components/ui/button.tsx";

export default function ErrorPage() {
    const error = useRouteError() as { status: number, statusText: string };
    console.log({...error})
    return (
        <div className={'min-h-screen w-full flex  flex-col items-center justify-center pb-20'}>
            <Link to={'/'} className={'flex flex-col items-center justify-center gap-1'}>
                <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-10 w-10'}/>
            </Link>
            <h1 className={'text-6xl py-4 font-semibold'}>{error.status}</h1>
            <h2 className={'text-3xl'}>Error: {error.statusText}</h2>
            <div className={'py-6'}>
                <Link to={'/'} className={buttonVariants({variant: "default"})}>Go to Home</Link>
            </div>
        </div>
    )
}