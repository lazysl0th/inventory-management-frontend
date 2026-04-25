import { TEntity } from './useEntityNavigation'
import useEntityNavigation from './useEntityNavigation'
import {
    getSelectedRows,
    resetSelectedRows,
    TTableIds,
} from '../../model/table/model/tableSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/providers/StoreProvider/store'
import { RowSelectionState } from '@tanstack/react-table'
import { TRowData } from '@/shared/ui/DataTable'

export interface IUpdateData<T> {
    ids: string[]
    data: Partial<T>
}

export interface IRoleData {
    userIds: string[]
    roleIds: number[]
}

interface IUseActionOptions<T> {
    tableId?: TTableIds
    onDelete?: (ids: string[]) => void
    onUpdate?: (updateData: IUpdateData<T>) => void
    onGrant?: (data: IRoleData) => void
    onRevoke?: (data: IRoleData) => void
}

interface IRecordHandlers<T> {
    openRecord: (id: number | string, replace?: boolean) => void
    addRecord: () => void
    deleteRecords: () => void
    updateRecords: (data: Partial<T>) => void
    grantRecords: (roleIds: number[]) => void
    revokeRecords: (roleIds: number[]) => void
    selectedRecords: RowSelectionState
}

export default function useRecordHandlers<T extends TRowData>(
    entity: TEntity,
    options?: IUseActionOptions<T>
): IRecordHandlers<T> {
    const dispatch = useDispatch()

    const selectedRecords =
        useSelector(
            (state: RootState) =>
                options?.tableId && getSelectedRows(state, options.tableId)
        ) || {}

    const { create, open } = useEntityNavigation<T>()

    const openRecord = (id: number | string, replace?: boolean): void =>
        open(entity, id, replace)

    const addRecord = (): void => create(entity)

    const resetSelection = () => {
        options?.tableId && dispatch(resetSelectedRows(options.tableId))
    }

    const deleteRecords = (): void => {
        const ids = Object.keys(selectedRecords)
        if (options?.onDelete) options.onDelete(ids)
        resetSelection()
    }

    const updateRecords = (data: Partial<T>): void => {
        const ids = Object.keys(selectedRecords)
        if (options?.onUpdate) options.onUpdate({ ids, data })
        resetSelection()
    }

    const grantRecords = (roleIds: number[]): void => {
        const userIds = Object.keys(selectedRecords)
        if (options?.onGrant) options.onGrant({ userIds, roleIds })
        resetSelection()
    }

    const revokeRecords = (roleIds: number[]): void => {
        const userIds = Object.keys(selectedRecords)
        if (options?.onRevoke) options.onRevoke({ userIds, roleIds })
        resetSelection()
    }

    return {
        openRecord,
        addRecord,
        deleteRecords,
        updateRecords,
        grantRecords,
        revokeRecords,
        selectedRecords,
    }
}
