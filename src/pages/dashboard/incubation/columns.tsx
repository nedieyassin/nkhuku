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
import {format} from "date-fns";

export type EggIncubation = {
    id: string
    incubatorId: string
    noOfEggs: number
    startDate: string
    endDate: string
    hatchingDate: string
    hatchingCount: number
    failedCount: number
    notes: string
    expand: {
        incubatorId: {
            name: string
        }
    }
}


export const columns: ColumnDef<EggIncubation>[] = [
    {
        accessorKey: "incubator",
        enableColumnFilter: true,
        header: ({column}) => <DataTableSortColumn title={'Incubator'} column={column}/>,
        cell: ({row}) => <Link className={'text-blue-600 hover:underline'}
                               to={`/dashboard/incubation/${row.original.id}`}>{row.original.expand?.incubatorId?.name}</Link>
    },
    {
        accessorKey: "noOfEggs",
        header: ({column}) => <DataTableSortColumn title={'No. of Eggs'} column={column}/>
    },
    {
        accessorKey: "startDate",
        header: ({column}) => <DataTableSortColumn title={'Incubation Start Date'} column={column}/>,
        cell: ({row}) => format(new Date(row.original.startDate), 'dd MMM, yyyy')
    },
    {
        accessorKey: "endDate",
        header: ({column}) => <DataTableSortColumn title={'Expected Incubation End Date'} column={column}/>,
        cell: ({row}) => format(new Date(row.original.endDate), 'dd MMM, yyyy')
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <div className={'inline-flex items-center flex-nowrap gap-3'}>
                    <Badge>
                        <Link to={`/dashboard/incubation/${row.original.id}`}
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
                            <Link to={`/dashboard/incubation/${row.original.id}`}>
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
