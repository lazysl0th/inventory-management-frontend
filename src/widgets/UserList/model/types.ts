
import type { IUser } from '@/entities/user'
import type { TTableIds } from '@/shared/model/table'
import type { IAction } from '@/shared/ui/ActionButtons'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'

export interface IUserList {
    children: ReactNode
    tableId?: TTableIds
    data: IUser[],
    isLoading: boolean,
    error?: FetchBaseQueryError | SerializedError,
    userActions?: IAction[]
}
