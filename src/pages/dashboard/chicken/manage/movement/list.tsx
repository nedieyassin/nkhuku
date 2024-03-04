import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {Link, useParams} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";
import {Icon} from "@iconify/react";
import {useDialog} from "react-dialog-promise";
import AlertDialogComp from "@/components/dialog/AlertDialogComp.tsx";
import {format} from "date-fns";
import {Movement} from "@/pages/dashboard/chicken/manage/movement/add.tsx";


export default function MovementList() {
    const params = useParams();
    const alertDialog = useDialog(AlertDialogComp);


    const {data: movements, isLoading, isFetching, refetch} = useQuery({
        queryKey: ['chickenMovements', params.chickenId],
        queryFn: () =>
            pb.collection('chickenMovements').getFullList<Movement>({
                sort: '-date',
                filter: `chickenBatchId="${params.chickenId}"`,
            }).then(r => r)
    })

    const handleDelete = (id: string) => {
        alertDialog.open({
            title: 'Are you sure you want to delete this?',
            description: 'All related data will be deleted. This action cannot be undone.'
        }).then((res) => {
            if (res) {
                pb.collection('chickenMovements').delete(id).then(() => {
                    refetch();
                })
            }
        })
    }


    return <>
        <div>
            <div className={'flex items-center justify-between gap-2'}>
                <div className={'flex items-center gap-2'}>
                    <h1 className={'font-bold text-xl line-clamp-1 w-full'}>Movement Logs</h1>
                </div>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={`/dashboard/chickens/${params.chickenId}/manage/movement/+`}>
                        <span>Add Movement</span>
                    </Link>
                </div>
            </div>
            <div className={'flex flex-col gap-2 py-4'}>
                {

                    isLoading || isFetching ?
                        <div className={'space-y-2'}>
                            <MovementCardSkeleton/>
                            <MovementCardSkeleton/>
                            <MovementCardSkeleton/>
                        </div>
                        : movements?.map((log) =>
                            <MovementCard key={log.id}
                                          handleDelete={handleDelete}
                                          log={log}/>)
                }
                {isLoading || isFetching ? null : movements?.length ? null :
                    <div className={'flex justify-center items-center flex-col gap-2 py-20'}>
                        <p className={'text-gray-500 text-sm'}>No movement found</p>
                        <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                              to={`/dashboard/chickens/${params.chickenId}/manage/movement/+`}>
                            <span>Add Movement</span>
                        </Link>
                    </div>}
            </div>
        </div>
    </>

}


function MovementCardSkeleton() {
    return <div className={'bg-gray-200 h-16 w-full rounded-md animate-pulse'}></div>
}

function MovementCard({log, handleDelete}: {
    log: Movement,
    handleDelete: (id: string) => void,
}) {
    return <div>
        <div
            className={'group flex items-center justify-between bg-white p-3 pl-4 border rounded-md cursor-pointer hover:bg-gray-50'}>
            <div>
                <p className={'text-lg font-bold'}>
                    <span>{format(new Date(log.date), 'dd MMM, yyyy')} - {log.noOfChickens} Chickens</span>
                </p>
                <div>
                    <span
                        className={'text-muted-foreground'}>{log.reason}</span>
                </div>
            </div>
            <div className={'flex gap-2'}>
                <Link className={buttonVariants({size: 'icon', variant: 'ghost'})}
                      to={`/dashboard/chickens/${log.chickenBatchId}/manage/movement/${log.id}`}>
                    <Icon icon={'eva:edit-fill'} className="h-5 w-5"/>
                </Link>
                <Button size={'icon'} variant={'ghost'} onClick={() => log.id && handleDelete(log.id)}>
                    <Icon icon={'eva:trash-2-fill'} className="h-5 w-5 text-red-500"/>
                </Button>
            </div>
        </div>
    </div>
}