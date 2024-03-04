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
import {format} from "date-fns";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge.tsx";

export type ChickenBatch = {
    id: string
    breedName: string
    breedId: string
    dateOfBirth: string
    numberOfMales: number
    numberOfFemales: number
    totalCount: number
    dateAcquired: number
    notes: string
    status: string
    averageWeight: number
    expand: {
        breedId: {
            breedName: string
        }
    }
}


export const columns: ColumnDef<ChickenBatch>[] = [
    {
        accessorKey: "breedName",
        enableColumnFilter: true,
        header: ({column}) => <DataTableSortColumn title={'Breed'} column={column}/>,
        cell: ({row}) => <Link className={'text-blue-600 hover:underline'}
                               to={`/dashboard/chickens/${row.original.id}/manage`}>{row.original.breedName}</Link>
    },
    {
        accessorKey: "totalCount",
        header: ({column}) => <DataTableSortColumn title={'No of chickens'} column={column}/>
    },
    {
        accessorKey: "dateOfBirth",
        header: ({column}) => <DataTableSortColumn title={'Date of Birth'} column={column}/>,
        cell: ({row}) => format(new Date(row.original.dateOfBirth), 'dd MMM, yyyy')
    },
    {
        accessorKey: "dateAcquired",
        header: ({column}) => <DataTableSortColumn title={'Date Acquired'} column={column}/>,
        cell: ({row}) => format(new Date(row.original.dateOfBirth), 'dd MMM, yyyy')
    },
    {
        accessorKey: "status",
        header: ({column}) => <DataTableSortColumn title={'Status'} column={column}/>,
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <div className={'inline-flex items-center flex-nowrap gap-3'}>
                    <Badge>
                        <Link to={`/dashboard/chickens/${row.original.id}/manage`}
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
                            <Link to={`/dashboard/chickens/${row.original.id}`}>
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
