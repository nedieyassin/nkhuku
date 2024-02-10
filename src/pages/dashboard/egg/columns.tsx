import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {DataTableSortColumn} from "@/components/data-table.tsx";
import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge.tsx";

export type EggBatch = {
    id: string
    breedId: string
    name: string
    noOfLayers: number
    noOfEggs: number
    startDate: string
    endDate: string
    notes: string
    isActive: boolean
    expand: {
        breedId: {
            breedName: string
        }
    }
}


export const columns: ColumnDef<EggBatch>[] = [
    {
        accessorKey: "name",
        enableColumnFilter: true,
        header: ({column}) => <DataTableSortColumn title={'Batch Name'} column={column}/>,
        cell: ({row}) => <Link className={'text-blue-600 hover:underline'}
                               to={`/dashboard/eggs/${row.original.id}`}>{row.original.name}</Link>
    },
    {
        accessorKey: "breedName",
        header: ({column}) => <DataTableSortColumn title={'Breed'} column={column}/>
    },
    {
        accessorKey: "noOfEggs",
        header: ({column}) => <DataTableSortColumn title={'No. of Eggs'} column={column}/>
    },
    {
        accessorKey: "noOfLayers",
        header: ({column}) => <DataTableSortColumn title={'No. of Layers'} column={column}/>
    },
    {
        accessorKey: "isActive",
        header: ({column}) => <DataTableSortColumn title={'Status'} column={column}/>,
        cell: ({row}) => row.original.isActive ? 'Active' : 'Inactive'
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <div className={'inline-flex items-center flex-nowrap gap-3'}>
                    <Badge>
                        <Link to={`/dashboard/eggs/${row.original.id}`}
                              className={'px-1.5 py-0.5'}>
                            Manage
                        </Link>
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link to={`/dashboard/eggs/${row.original.id}`}>
                                <DropdownMenuItem>
                                    <Icon icon={'eva:edit-fill'} className="mr-2 h-5 w-5"/>
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <Icon icon={'eva:trash-2-fill'} className="mr-2 h-5 w-5 text-red-500"/>
                                <span className={'text-red-500'}>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
    // ...
]
