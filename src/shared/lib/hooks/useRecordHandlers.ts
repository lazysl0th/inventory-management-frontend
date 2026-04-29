import type { TEntity } from './useEntityNavigation'
import useEntityNavigation from './useEntityNavigation'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/providers/StoreProvider/store'
import type { RowSelectionState } from '@tanstack/react-table'
import type { TRowData } from '@/shared/ui/DataTable'
import { showToast } from '@/shared/model/ui'
import { useTranslation } from 'react-i18next'
import {
    getSelectedRows,
    resetSelectedRows,
    type TTableIds,
} from '@/shared/model/table'

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
    onDelete?: (ids: string[]) => Promise<{ count: number }>
    onUpdate?: (updateData: IUpdateData<T>) => Promise<{ count: number }>
    onGrant?: (data: IRoleData) => Promise<{ count: number }>
    onRevoke?: (data: IRoleData) => Promise<{ count: number }>
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
    const { t } = useTranslation('common')

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

    const deleteRecords = async (): Promise<void> => {
        const ids = Object.keys(selectedRecords)
        if (!options?.onDelete || ids.length === 0) return
        try {
            const deletedRecords = await options.onDelete(ids)
            dispatch(
                showToast({
                    message: t('common:notifications.successAction', {
                        count: deletedRecords.count,
                        actionType: 'deleted',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            resetSelection()
        } catch (e) {
            dispatch(
                showToast({
                    message: t('common:notifications.errorAction', {
                        count: ids.length,
                        actionType: 'deleting',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            console.log(e)
        }
    }

    const updateRecords = async (data: Partial<T>): Promise<void> => {
        const ids = Object.keys(selectedRecords)
        if (!options?.onUpdate || ids.length === 0) return
        try {
            const updatedRecords = await options.onUpdate({ ids, data })
            dispatch(
                showToast({
                    message: t('common:notifications.successAction', {
                        count: updatedRecords.count,
                        actionType: 'updated',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            resetSelection()
        } catch (e) {
            dispatch(
                showToast({
                    message: t('common:notifications.errorAction', {
                        count: ids.length,
                        actionType: 'updating',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            console.log(e)
        }
    }

    const grantRecords = async (roleIds: number[]): Promise<void> => {
        const userIds = Object.keys(selectedRecords)
        if (!options?.onGrant || userIds.length === 0) return
        try {
            const updatedRecords = await options.onGrant({ userIds, roleIds })
            dispatch(
                showToast({
                    message: t('common:notifications.successAction', {
                        count: updatedRecords.count,
                        actionType: 'updated',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            resetSelection()
        } catch (e) {
            dispatch(
                showToast({
                    message: t('common:notifications.errorAction', {
                        count: userIds.length,
                        actionType: 'updating',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            console.log(e)
        }
    }

    const revokeRecords = async (roleIds: number[]): Promise<void> => {
        const userIds = Object.keys(selectedRecords)
        if (!options?.onRevoke || userIds.length === 0) return
        try {
            const updatedRecords = await options.onRevoke({ userIds, roleIds })
            dispatch(
                showToast({
                    message: t('common:notifications.successAction', {
                        count: updatedRecords.count,
                        actionType: 'updated',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            resetSelection()
        } catch (e) {
            dispatch(
                showToast({
                    message: t('common:notifications.errorAction', {
                        count: userIds.length,
                        actionType: 'updating',
                        recordType: entity.toLocaleLowerCase(),
                    }),
                })
            )
            console.log(e)
        }
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
