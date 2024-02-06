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

export type Feed = {
    id: string
    type: string
    feedName: string
    quantity: number
    description: string
}


export const columns: ColumnDef<Feed>[] = [
    {
        accessorKey: "feedName",
        enableColumnFilter: true,
        header: ({column}) => <DataTableSortColumn title={'Feed Name'} column={column}/>,
        cell: ({row}) => <Link className={'text-blue-600 hover:underline'}
                               to={`/dashboard/configuration/feeds/${row.original.id}`}>{row.original.feedName}</Link>
    },
    {
        accessorKey: "type",
        header: ({column}) => <DataTableSortColumn title={'Type'} column={column}/>
    },
    {
        accessorKey: "quantity",
        header: ({column}) => <DataTableSortColumn title={'Quantity Available'} column={column}/>
    },
    {
        id: "actions",

        cell: ({row}) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link to={`/dashboard/configuration/feeds/${row.original.id}`}>
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
            )
        },
    },
    // ...
]
