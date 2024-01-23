import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";
import {buttonVariants} from "@/components/ui/button.tsx";
import WebsiteFooter from "@/layouts/WebsiteFooter.tsx";

export default function HomePage() {
    return (
        <div className={'antialiased'}>
            <div className={'w-full  flex items-center fixed top-0 left-0 right-0 h-16 bg-white z-50'}>
                <div className={'container flex items-center justify-between px-4 mx-auto'}>
                    <div className={'flex gap-3 items-center'}>
                        <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-10 w-10'}/>
                        <h1 className={'text-2xl font-bold'}>NKHUKU</h1>
                    </div>
                    <div>
                        <Link to={'/login'} className={buttonVariants({variant: "link"})}>Login</Link>
                        <Link to={'/register'} className={buttonVariants({variant: "link"})}>Register</Link>
                    </div>
                </div>
            </div>
            <div>
                {/* Hero Section  */}
                <section className={'pt-20 md:pt-32 md:pb-10 w-full'}>
                    <div className={'container grid grid-cols-1 md:grid-cols-2 mx-auto gap-6'}>
                        <div className={'space-y-2 order-2 md:order-1 md:pt-32'}>
                            <h1 className={'text-6xl font-bold'}>Welcome to <span
                                className={'bg-gradient-to-br from-purple-500 to-blue-500 bg-clip-text text-transparent'}>Nkhuku</span>
                            </h1>
                            <h2 className={'text-gray-500 italic relative'}>
                                <span className={'font-bold text-3xl text-gray-300 absolute -left-4 -top-2'}>"</span>
                                <span>Empowering Farmers, Enhancing
                                Harvests</span>
                                <span className={'font-bold text-3xl text-gray-300 absolute -bottom-2'}>"</span>
                            </h2>
                            <p>
                                Managing your poultry farm has never been easier. Nkhuku is designed
                                to streamline every aspect of your chicken farming operation. From inventory tracking
                                and
                                feeding schedules to health monitoring and egg production analysis, Nkhuku is your
                                all-in-one solution for efficient and profitable poultry farming.
                            </p>
                            <div className={'flex flex-col md:flex-row py-6 gap-4'}>
                                <Link to={'/login'} className={buttonVariants({variant: "default"})}>
                                    Login to your account
                                </Link>
                                <Link to={'/register'} className={buttonVariants({variant: "link"})}>Register a new
                                    account</Link>
                            </div>
                        </div>
                        <div className={'order-1 md:order-2 flex items-start justify-center'}>
                            <img
                                src="/public/banner.png"
                                alt=""
                                className={'object-contain  md:aspect-square md:h-96'}
                            />
                        </div>
                    </div>
                </section>
                {/* End Hero Section  */}


                {/* Features Section  */}
                <section className={'py-16'}>
                    <div className={'container mx-auto'}>
                        <h1 className={'text-4xl font-bold'}>Features</h1>

                        <div className={'grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'}>
                            {/**/}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>Inventory Tracking</h1>
                                <p>
                                    Keep track of your farm's inventory and monitor your
                                    production.
                                </p>
                            </div>
                            {/*    */}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>Health Monitoring</h1>
                                <p>
                                    Monitor your farm's health and ensure that your
                                    chickens and eggs are healthy.
                                </p>
                            </div>
                            {/*    */}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>Egg Production Monitoring</h1>
                                <p>
                                    Record and analyse egg production data for better farm productivity. <br/>
                                    Visualize egg production trends and generate detailed reports.
                                </p>
                            </div>
                            {/*    */}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>Incubation Management</h1>
                                <p>
                                    Manage the incubation process with details on turning schedules and temperature
                                    settings. <br/>
                                    Track incubation progress and estimate hatching dates.
                                </p>
                            </div>
                            {/*    */}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>Analytics and Reporting</h1>
                                <p>
                                    Generate detailed reports for in-depth analysis and decision-making.
                                </p>
                            </div>
                            {/*    */}
                            <div className={'space-y-2 p-4'}>
                                <h1 className={'text-xl font-semibold'}>User-Friendly Interface</h1>
                                <p>
                                    Streamline your farm operations with a user-friendly interface.
                                </p>
                            </div>
                            {/*    */}
                        </div>
                    </div>
                </section>
                {/* End Features Section  */}

            </div>
            <WebsiteFooter/>
        </div>
    )
}