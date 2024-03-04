import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {Link, useParams} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";
import {Icon} from "@iconify/react";
import {useDialog} from "react-dialog-promise";
import AlertDialogComp from "@/components/dialog/AlertDialogComp.tsx";
import {FeedLog} from "@/pages/dashboard/chicken/manage/feeding/add.tsx";
import {format} from "date-fns";


export default function FeedingList() {
    const params = useParams();
    const alertDialog = useDialog(AlertDialogComp);


    const {data: feedingLogs, isLoading, isFetching, refetch} = useQuery({
        queryKey: ['feedingLogs', params.chickenId],
        queryFn: () =>
            pb.collection('feedingLogs').getFullList<FeedLog>({
                expand: 'feedFormulaId',
                sort: '-feedDate',
                filter: `chickenBatchId="${params.chickenId}"`,
            }).then(r => r)
    })

    const handleDelete = (id: string) => {
        alertDialog.open({
            title: 'Are you sure you want to delete this?',
            description: 'All related data will be deleted. This action cannot be undone.'
        }).then((res) => {
            if (res) {
                pb.collection('feedingLogs').delete(id).then(() => {
                    refetch();
                })
            }
        })
    }


    return <>
        <div>
            <div className={'flex items-center justify-between gap-2'}>
                <div className={'flex items-center gap-2'}>
                    <h1 className={'font-bold text-xl line-clamp-1 w-full'}>Feeding Logs</h1>
                </div>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={`/dashboard/chickens/${params.chickenId}/manage/feeding/+`}>
                        <span>Add Feed Log</span>
                    </Link>
                </div>
            </div>
            <div className={'flex flex-col gap-2 py-4'}>
                {

                    isLoading || isFetching ?
                        <div className={'space-y-2'}>
                            <FeedingLogCardSkeleton/>
                            <FeedingLogCardSkeleton/>
                            <FeedingLogCardSkeleton/>
                        </div>
                        : feedingLogs?.map((log) =>
                            <FeedingLogCard key={log.id}
                                            handleDelete={handleDelete}
                                            feedingLog={log}/>)
                }
                {isLoading || isFetching ? null : feedingLogs?.length ? null :
                    <div className={'flex justify-center items-center flex-col gap-2 py-20'}>
                        <p className={'text-gray-500 text-sm'}>No feed logs found</p>
                        <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                              to={`/dashboard/chickens/${params.chickenId}/manage/feeding/+`}>
                            <span>Add Feed Log</span>
                        </Link>
                    </div>}
            </div>
        </div>
    </>

}


function FeedingLogCardSkeleton() {
    return <div className={'bg-gray-200 h-16 w-full rounded-md animate-pulse'}></div>
}

function FeedingLogCard({feedingLog, handleDelete}: {
    feedingLog: FeedLog,
    handleDelete: (id: string) => void,
}) {
    return <div>
        <div
            className={'group flex items-start justify-between bg-white p-3 pl-4 border rounded-md cursor-pointer hover:bg-gray-50'}>
            <div>
                <p className={'text-lg font-bold'}>
                    <span>{format(new Date(feedingLog.feedDate), 'dd MMM, yyyy')} - {feedingLog.feedTime}</span></p>
                <div>
                    <span
                        className={'text-muted-foreground'}>{feedingLog.expand?.feedFormulaId?.formulaName || '-'}</span> - <span>{feedingLog.quantity}</span>
                </div>
            </div>
            <div className={'flex gap-2'}>
                <Link className={buttonVariants({size: 'icon', variant: 'ghost'})}
                      to={`/dashboard/chickens/${feedingLog.chickenBatchId}/manage/feeding/${feedingLog.id}`}>
                    <Icon icon={'eva:edit-fill'} className="h-5 w-5"/>
                </Link>
                <Button size={'icon'} variant={'ghost'} onClick={() => feedingLog.id && handleDelete(feedingLog.id)}>
                    <Icon icon={'eva:trash-2-fill'} className="h-5 w-5 text-red-500"/>
                </Button>
            </div>
        </div>
    </div>
}