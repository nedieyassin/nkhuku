import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {Breed, columns} from "@/pages/dashboard/configuration/breed/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function BreedList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['breeds'],
        queryFn: () =>
            pb.collection('breeds').getFullList<Breed>({
                sort: '-created',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Breed Name",
            value: "breedName",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Breeds</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={'/dashboard/configuration/breeds/+'}>
                        <span>Add Breed</span>
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