import { useDispatch, useSelector } from 'react-redux'
import {
    getSelectedRows,
    resetSelectedRows,
    toggleSelectedRow,
} from '@/shared/model/table/model/tableSlice'
import type { RootState } from '@/app/providers/StoreProvider/store'
import { useAllowedUserColumns } from '../lib/useAllowedUserColumns'
import type { IAllowedUserList } from '../model/types'
import { Section } from '@/shared/ui/Section'
import type { RowSelectionState } from '@tanstack/react-table'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { useAllowedUserActions } from '../lib/useAllowedUserAction'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import { useParams } from 'react-router-dom'
import { useGetInventoryQuery } from '@/entities/inventory/api/inventoryApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { useTranslation } from 'react-i18next'
import type { TAllowedUser } from '@/entities/inventory'
import { DataTable } from '@/shared/ui/DataTable'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'

const initialAllowedUser: TAllowedUser = {
    id: 0,
    name: '',
    email: '',
}

const AllowedUserList = ({ tableId }: IAllowedUserList) => {
    const {t} = useTranslation('inventory')
    const dispatch = useDispatch()

    const { inventoryId } = useParams()

    const { data: inventory } = useGetInventoryQuery(
        inventoryId && inventoryId !== 'new' ? { inventoryId } : skipToken
    )

    const { field: allowedUsersField } =
        useFormikApi<TAllowedUser[]>('allowedUsers')

    const { addHandler, deleteHandler } = useSortableHandlers<TAllowedUser>(
        allowedUsersField.value,
        allowedUsersField.setValue,
        (allowedUser) => allowedUser.id
    )

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    const addAllowedUserHandler = () => {
        if (
            allowedUsersField.value.findIndex(
                (allowedUser) => allowedUser.id === 0
            ) !== -1
        )
            return
        addHandler(initialAllowedUser)
    }

    const deleteAllowedUsersHandler = () => {
        deleteHandler(Object.keys(selectedRows).map(Number))
        tableId && dispatch(resetSelectedRows(tableId))
    }

    const allowedUserActions = useAllowedUserActions({
        onAdd: addAllowedUserHandler,
        onDelete: deleteAllowedUsersHandler,
        onAddState: !isAdmin && !isOwner,
        onDeleteState: (!isAdmin && !isOwner),
        selectedCount: Object.keys(selectedRows).length
    })

    const allowedUserColumns = useAllowedUserColumns()

    return (
        <Section>
            <h3>{t('inventory:listTitle.allowedUsers')}</h3>
            <DataTable<TAllowedUser, string>
                tableId={tableId}
                data={allowedUsersField.value}
                columns={allowedUserColumns}
                rowSelection={selectedRows}
                enableRowSelection={!isAdmin && !isOwner ? false : true}
                onRowSelectionChange={selectRowHandle}
            >
                <ActionButtons
                    actions={allowedUserActions}
                    className='d-flex'
                />
            </DataTable>
        </Section>
    )
}

export default AllowedUserList
