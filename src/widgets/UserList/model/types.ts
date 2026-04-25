import { TTableIds } from '@/shared/model/table/model/tableSlice'
import { ReactNode } from 'react'

export interface IUserList {
    children: ReactNode
    actionButtons?: boolean
    tableId?: TTableIds
}
