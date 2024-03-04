import {useQuery} from "@tanstack/react-query";
import pb from "@/lib/pocketbase.ts";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {ChickenBatch} from "@/pages/dashboard/chicken/columns.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {differenceInWeeks} from "date-fns";
import {cn} from "@/lib/utils.ts";
import {useEffect} from "react";


type Action = {
    id: string
    icon: string
    label: string
    link: string
}

export default function ManageChicken() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isManage = (location.pathname.slice(location.pathname.lastIndexOf('/manage')).replaceAll('/', '') === 'manage')

    const {data: chickenBatch} = useQuery({
        queryKey: ['chickenBatches', params.chickenId],
        queryFn: () => pb.collection('chickenBatches').getOne<ChickenBatch>(params.chickenId || '', {
            expand: 'breedId'
        }).then((record) => record).then(r => r)
    })

    const actions: Action[] = [
        {
            id: 'feed',
            icon: 'lucide:wheat',
            label: 'Feed Chickens',
            link: `/dashboard/chickens/${params.chickenId}/manage/feeding`
        },
        {
            id: 'health',
            icon: 'lucide:heart-pulse',
            label: 'Chicken Health Check',
            link: `/dashboard/chickens/${params.chickenId}/manage/health`
        },
        {
            id: 'movement',
            icon: 'lucide:arrow-right-left',
            label: 'Chicken Movements',
            link: `/dashboard/chickens/${params.chickenId}/manage/movement`
        },
        {
            id: 'vaccination',
            icon: 'lucide:syringe',
            label: 'Medication and Vaccination',
            link: `/dashboard/chickens/${params.chickenId}/manage/medication`
        }
    ]

    useEffect(() => {
        const tab = (new URLSearchParams(location.search)).get('tab');
        if (tab) {
            const element = document.getElementById(tab);
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    }, [location.search]);

    const onActionClick = (id: string, link: string) => {
        navigate(link + '?tab=' + id);
    }

    return <div>
        <div>
            <div className={'flex items-center justify-between gap-2'}>
                <div className={'flex gap-4'}>
                    <div className={'pt-1'}>
                        <Button className={'shrink-0'} onClick={() => navigate(-1)} size={'icon'} variant={'outline'}>
                            <Icon icon={'lucide:arrow-left'} className={'h-5 w-5'}/>
                        </Button>
                    </div>
                    <div>
                        <h1 onClick={() => navigate(`/dashboard/chickens/${params.chickenId}`)}
                            className={'font-bold text-xl md:text-3xl line-clamp-1 w-full cursor-pointer hover:underline'}>{chickenBatch?.expand.breedId.breedName}</h1>
                        <p className={'text-sm'}><b>{chickenBatch?.totalCount}</b> Chickens
                            - <b>{differenceInWeeks(new Date(), new Date(chickenBatch?.dateOfBirth || new Date()))}</b> weeks
                            old</p>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
        <div className={'py-2'}>
            <div className={'flex gap-3 items-center'}>
                {!isManage &&
                    <Button onClick={() => navigate(`/dashboard/chickens/${params.chickenId}/manage`)} size={'icon'}
                            variant={'ghost'}>
                        <Icon icon={'lucide:home'} className={'h-4 w-4'}/>
                    </Button>}
                <h1 className={'text-2xl font-bold'}>Manage</h1>
            </div>
            <div className={'py-4'}>
                <div
                    className={cn('grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', {'flex overflow-x-auto pb-2': !isManage})}>
                    {actions.map((action) => (
                        <ActionCard key={action.id} id={action.id} isManage={isManage} icon={action.icon}
                                    link={action.link}
                                    label={action.label} onActionClick={onActionClick}/>
                    ))}
                </div>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    </div>
}

function ActionCard({id, icon, label, link, isManage, onActionClick}: Action & {
    isManage: boolean,
    onActionClick: (id: string, link: string) => void
}) {
    const tab = (new URLSearchParams(location.search)).get('tab');
    return <div onClick={() => onActionClick(id, link)}
                id={id}
                className={cn('transition-all flex items-center gap-4 px-6 py-6 bg-white rounded-md shadow border border-gray-200 cursor-pointer select-none', {
                    'py-2 px-4 whitespace-nowrap': !isManage,
                    'bg-black text-white': tab === id
                })}>
        <Icon icon={icon} className={cn('h-8 w-8 shrink-0 transition-al', {'h-5 w-5': !isManage})}/>
        <p className={cn('text-xl font-bold transition-al', {'text-sm': !isManage})}>{label}</p>
    </div>
}