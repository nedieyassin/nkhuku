import useStore from "@/state";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Icon} from "@iconify/react";

export default function DashboardPage() {
    const {currentUser} = useStore((state) => state);
    return (
        <div>
            <div className={'py-4'}>
                <h1 className={'text-3xl'}>Welcome, <span className={'font-bold'}>{currentUser?.name}</span></h1>
            </div>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                No of Chickens
                            </CardTitle>
                            <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-4 w-4'}/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">365</div>
                            <p className="text-xs text-muted-foreground">
                                chickens
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                No of Eggs
                            </CardTitle>
                            <Icon icon={'fluent-emoji-high-contrast:egg'} className={'h-4 w-4'}/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">150</div>
                            <p className="text-xs text-muted-foreground">
                                eggs
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eggs in incubator</CardTitle>
                            <Icon icon={'lucide:heater'} className={'h-4 w-4'}/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">234</div>
                            <p className="text-xs text-muted-foreground">
                                eggs
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Next Hatch Date
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">26 Feb, 2024</div>
                            <p className="text-xs text-muted-foreground">
                                 estimated hatch date
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}