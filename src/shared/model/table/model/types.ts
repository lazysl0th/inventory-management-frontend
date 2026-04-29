import {
    MY_INVENTORIES,
    ALL_INVENTORIES,
    ALLOWED_USERS,
    INVENTORY_ITEMS,
    ALL_USERS,
} from '@/shared/config/constants/tableIds'
import type { RowSelectionState } from '@tanstack/react-table'

export type TTableIds =
    | typeof MY_INVENTORIES
    | typeof ALL_INVENTORIES
    | typeof ALLOWED_USERS
    | typeof INVENTORY_ITEMS
    | typeof ALL_USERS

export interface ITableProps {
    selectedRows: RowSelectionState
}

export type TTableState = Record<TTableIds, ITableProps>
