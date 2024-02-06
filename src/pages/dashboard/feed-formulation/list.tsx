import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {FeedFormulation, columns} from "@/pages/dashboard/feed-formulation/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function FeedFormulationList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['feedFormulas'],
        queryFn: () =>
            pb.collection('feedFormulas').getFullList<FeedFormulation>({
                sort: '-created',
                expand: 'breed',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Formula Name",
            value: "formulaName",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Feed Formulas</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={'/dashboard/feed-formulation/+'}>
                        <span>Add Feed Formula</span>
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