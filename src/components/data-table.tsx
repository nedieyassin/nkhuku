import {
    Column,
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {Icon} from "@iconify/react";
import {Input} from "@/components/ui/input.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {Badge} from "@/components/ui/badge.tsx";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterableColumns?: FilterableColumns[],
    filter?: boolean,
    refetch?: () => void
    isLoading?: boolean
}

export interface FilterableColumns {
    label: string
    value: string
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             filterableColumns = [],
                                             refetch,
                                             isLoading = false,
                                             filter = false
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div>
            <div className="flex items-center justify-start gap-2 py-2">
                {filter && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className={'space-x-1'} variant={'outline'}>
                            <Icon icon={'lucide:list-filter'}/>
                            <span>Filters</span>
                            {columnFilters.length > 0 &&
                                <Badge className={'px-1.5 text-xs'}>{columnFilters.length}</Badge>}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60 ml-3">
                        <DropdownMenuLabel>
                            <div className={'flex w-full items-center justify-between'}>
                                <span>All Filters</span>
                                <Badge onClick={() => setColumnFilters([])} className={'cursor-pointer'}
                                       variant={'destructive'}>Clear All</Badge>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <div className={'px-2'}>
                            <Accordion type="multiple" className="w-full">
                                {filterableColumns.map((column) => (
                                    <AccordionItem value={column.value} key={column.value}>
                                        <AccordionTrigger>
                                            <div className={'space-x-1'}>
                                                <span>{column.label}</span>
                                                {table.getColumn(column.value)?.getFilterValue() as string &&
                                                    <Badge className={'px-0.5'}><Icon icon={'lucide:check'}/></Badge>}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className={'p-1'}>
                                                <Input
                                                    placeholder={'Filter by ' + column.label}
                                                    value={(table.getColumn(column.value)?.getFilterValue() as string) ?? ""}
                                                    onChange={(event) => {
                                                        table.getColumn(column.value)?.setFilterValue(event.target.value)
                                                    }}
                                                    className="max-w-sm"
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>}
                <Button onClick={() => refetch ? refetch() : null} variant={'outline'} size={'icon'}>
                    <Icon icon={'lucide:refresh-cw'}
                          className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell align={cell.id.includes('actions') ? 'right' : 'left'} key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 select-none">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <Icon icon={'lucide:arrow-left'}/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <Icon icon={'lucide:arrow-right'}/>
                </Button>
            </div>
        </div>
    )
}

export function DataTableSortColumn<T>({title, column}: { title: string, column: Column<T, unknown> }) {
    return <button
        className={'flex items-center'}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {title}
        {column.getIsSorted() === "asc" && <Icon icon={"lucide:arrow-up"} className="ml-2 h-4 w-4"/>}
        {column.getIsSorted() === "desc" && <Icon icon={"lucide:arrow-down"} className="ml-2 h-4 w-4"/>}
    </button>;
}