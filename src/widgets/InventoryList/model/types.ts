import {
    IInventoriesRequestParams,
    IInventorySearchParam,
} from '@/entities/inventory/model/types'
import { TTableIds } from '@/shared/model/table/model/tableSlice'
import { ReactNode } from 'react'

export interface IInventoryList {
    children: ReactNode
    actionButtons?: boolean
    requestParams?: IInventoriesRequestParams
    searchParam?: IInventorySearchParam
    tableId?: TTableIds
}
