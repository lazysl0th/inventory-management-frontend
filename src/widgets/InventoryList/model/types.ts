
import type { TInventoryListItem } from '@/entities/inventory'
import type { TTableIds } from '@/shared/model/table'
import type { IAction } from '@/shared/ui/ActionButtons'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'

export interface IInventoryList {
    children: ReactNode
    actionButtons?: boolean
    data: TInventoryListItem[],
    isLoading: boolean,
    error?: FetchBaseQueryError | SerializedError,
    tableId?: TTableIds
    inventoryActions?: IAction[]
}
