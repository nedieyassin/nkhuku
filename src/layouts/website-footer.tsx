import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";

export default function WebsiteFooter() {
    return (
        <div className={'bg-black py-4'}>
            <div className={'container mx-auto'}>
                <div className={'space-y-2'}>
                    <div className={'flex flex-col md:flex-row justify-between'}>
                        <div className={'flex items-center justify-center gap-3'}>
                            <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-6 w-6 text-white'}/>
                            <h1 className={'text-white text-xl font-bold'}>Nkhuku</h1>
                        </div>
                        <div className={'flex items-center justify-center gap-4 py-4'}>
                            <Link to={'/login'} className={'text-sm hover:underline text-gray-200'}>Login</Link>
                            <Link to={'/register'} className={'text-sm hover:underline text-gray-200'}>Register</Link>
                            <Link to={'/'} className={'text-sm hover:underline text-gray-200'}>Terms and
                                Conditions</Link>
                            <Link to={'/dashboard'} className={'text-sm hover:underline text-gray-200'}>About</Link>
                        </div>
                    </div>
                    <p className={'text-gray-500 text-center text-sm'}>Copyright © {new Date().getFullYear()} Nkhuku.
                        All Rights Reserved. Developed by <a href="https://nedieyassin.com" target={'_blank'}
                                                             className={'text-sm hover:underline text-gray-200'}>Nedie
                            Yassin</a></p>
                </div>
            </div>
        </div>
    )
}