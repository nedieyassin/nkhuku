import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {EggBatch, columns} from "@/pages/dashboard/egg/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function EggList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['eggBatches'],
        queryFn: () =>
            pb.collection('eggBatches').getFullList<EggBatch>({
                sort: '-created',
                expand: 'breedId',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Batch Name",
            value: "name",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Egg Batches</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})} to={'/dashboard/eggs/+'}>
                        <span>Add Batch</span>
                    </Link>
                </div>
            </div>
            <div className={'py-4'}>
                <DataTable
                    columns={columns}
                    data={data?.map((r) => ({
                        ...r,
                        breedName: r.expand?.breedId?.breedName,
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