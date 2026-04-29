import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type Row,
    type Updater,
    type RowSelectionState,
} from '@tanstack/react-table'
import { Table } from 'react-bootstrap'
import DataTableRow from './DataTableRow/DataTableRow'
import { lazy, useId, useState } from 'react'
import DataTablePagination from './DataTablePagination/DataTablePagination'
import DataTableToolbar from './DataTableToolbar/DataTableToolbar'
import type { IDataTableProps, TRowData } from '../model/types'

const IndeterminateCheckbox = lazy(() => import('../../IndeterminateCheckbox').then(module => ({ default: module.IndeterminateCheckbox })))

export default function DataTable<TData extends TRowData, TValue>({
    tableId,
    data,
    columns,
    enableRowSelection = false,
    rowSelection,
    onRowSelectionChange,
    onRowClick,
    children,
}: IDataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
    const [globalFilter, setGlobalFilter] = useState('')
    const defaultId = useId()

    const setRowSelection = (updaterOrValue: Updater<RowSelectionState>) => {
        if (onRowSelectionChange) {
            const selectedRows =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(rowSelection || {})
                    : updaterOrValue
            onRowSelectionChange(selectedRows)
        }
    }

    function getRowId(row: TData, index: number, parent?: Row<TData>): string {
        if (row.id !== undefined && row.id !== null) return String(row.id)
        if (parent) return `${parent.id}.${index}`
        return String(index)
    }

    function withRowSelection<TData, TValue>(
        columns: ColumnDef<TData, TValue>[]
    ): ColumnDef<TData, TValue>[] {
        return [
            {
                id: 'select',
                size: 40,
                enableSorting: false,
                enableColumnFilter: false,
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
            },
            ...columns,
        ]
    }

    const table = useReactTable({
        data,
        columns: enableRowSelection ? withRowSelection(columns) : columns,
        enableRowSelection,
        pageCount: Math.ceil(data.length / pagination.pageSize),
        state: { pagination, globalFilter, rowSelection },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId,
        manualPagination: false,
        meta: {
            onRowClick,
            tableId: tableId ?? defaultId,
        },
    })
    return (
        <>
            <DataTableToolbar table={table}>{children}</DataTableToolbar>
            <Table className='mb-0' hover responsive>
                <thead>
                    {table.getHeaderGroups().map((group) => (
                        <tr key={group.id}>
                            {group.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={'text-nowrap text-center'}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <DataTableRow
                            key={row.id}
                            row={row}
                            meta={table.options.meta}
                        />
                    ))}
                </tbody>
            </Table>
            <DataTablePagination table={table} />
        </>
    )
}
