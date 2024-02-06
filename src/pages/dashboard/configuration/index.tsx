import {Link, Outlet, useLocation} from "react-router-dom";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

export default function IncubationList() {
    const location = useLocation().pathname;

    return <div className={'space-y-4'}>
        <div className={'flex gap-2 pb-6'}>
            <Tabs
                value={location.includes('/configuration/breeds') ? 'breeds' : location.includes('/configuration/feeds') ? 'feeds' : ''}>
                <TabsList>
                    <TabsTrigger value="breeds" asChild>
                        <Link to={'/dashboard/configuration/breeds'}>Breeds</Link>
                    </TabsTrigger>
                    <TabsTrigger value="feeds" asChild>
                        <Link to={'/dashboard/configuration/feeds'}>Feeds</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        <Outlet />
    </div>

}