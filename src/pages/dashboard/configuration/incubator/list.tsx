import {buttonVariants} from "@/components/ui/button.tsx";
import {DataTable, FilterableColumns} from "@/components/data-table.tsx";
import {Incubator, columns} from "@/pages/dashboard/configuration/incubator/columns.tsx";
import {Link} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {useQuery} from "@tanstack/react-query";

export default function IncubatorList() {

    const {isPending, data, isFetching, refetch} = useQuery({
        queryKey: ['incubators'],
        queryFn: () =>
            pb.collection('incubators').getFullList<Incubator>({
                sort: '-created',
            }).then(r => r)
    })


    const filterColumns: FilterableColumns[] = [
        {
            label: "Name",
            value: "name",
        },
        {
            label: "Mobile Number",
            value: "mobileNumber",
        }
    ];

    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <h1 className={'font-bold text-xl md:text-3xl'}>Incubators</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={'/dashboard/configuration/incubators/+'}>
                        <span>Add Incubator</span>
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