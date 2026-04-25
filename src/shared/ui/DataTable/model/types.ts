import { TTableIds } from '@/shared/model/table/model/tableSlice'
import {
    ColumnDef,
    Row,
    RowData,
    RowSelectionState,
    Table,
    TableMeta,
} from '@tanstack/react-table'
import { ReactNode } from 'react'

export enum Typename {
    Inventory = 'Inventory',
    Item = 'Item',
    User = 'User',
}

interface IBaseRowData {
    id: number
}

export type TRowData = RowData & IBaseRowData

export interface IDataTableProps<TData extends TRowData, TValue> {
    tableId?: TTableIds
    data: TData[]
    columns: ColumnDef<TData, TValue>[]
    enableRowSelection?: boolean
    rowSelection?: RowSelectionState
    onRowSelectionChange?: (selection: RowSelectionState) => void
    onRowClick?: (id: number) => void
    children?: ReactNode
}

export interface IDataTablePaginationProps<TData> {
    table: Table<TData>
}

export interface IDataTableRowProps<TData extends TRowData> {
    row: Row<TData>
    meta?: TableMeta<TData>
}

export interface IDataTableToolbarProps<TData> {
    table: Table<TData>
    children?: ReactNode
}
