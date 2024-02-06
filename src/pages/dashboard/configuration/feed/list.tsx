import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {Feed, columns} from "@/pages/dashboard/configuration/feed/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function FeedList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['feeds'],
        queryFn: () =>
            pb.collection('feeds').getFullList<Feed>({
                sort: '-created',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Feed Name",
            value: "feedName",
        },
        {
            label: "Type",
            value: "type",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Feeds</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={'/dashboard/configuration/feeds/+'}>
                        <span>Add Feed</span>
                    </Link>
                </div>
            </div>
            <div className={'py-4'}>
                <DataTable
                    columns={columns}
                    data={data || []}
                    filter={true}
                    isLoading={isPending || isFetching}
                    refetch={refetch}
                    filterableColumns={filterColumns}
                />
            </div>
        </div>
    </>

}