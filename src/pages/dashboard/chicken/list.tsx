import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {ChickenBatch, columns} from "@/pages/dashboard/chicken/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function ChickenList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['chickenBatches'],
        queryFn: () =>
            pb.collection('chickenBatches').getFullList<ChickenBatch>({
                sort: '-created',
                expand: 'breedId',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Breed Name",
            value: "breedName",
        },
        {
            label: "Total Count",
            value: "totalCount",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Chicken Batches</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})} to={'/dashboard/chickens/+'}>
                        <span>Add Batch</span>
                    </Link>
                </div>
            </div>
            <div className={'py-4'}>
                <DataTable
                    columns={columns}
                    data={data?.map((r) => ({
                        ...r,
                        breedName: r.expand?.breedId?.breedName
                    })) || []}
                    filter={true}
                    isLoading={isPending || isFetching}
                    refetch={refetch}
                    filterableColumns={filterColumns}
                />
            </div>
        </div>
    </>

}