import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {EggIncubation, columns} from "@/pages/dashboard/incubation/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function EggIncubationList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['eggIncubations'],
        queryFn: () =>
            pb.collection('eggIncubations').getFullList<EggIncubation>({
                sort: '-created',
                expand: 'incubatorId',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Incubator",
            value: "incubator",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Egg Incubations</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})} to={'/dashboard/incubation/+'}>
                        <span>Add Incubation</span>
                    </Link>
                </div>
            </div>
            <div className={'py-4'}>
                <DataTable
                    columns={columns}
                    data={data?.map((r) => ({
                        ...r,
                        incubator: r.expand?.incubatorId?.name,
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