import { TAllowedUser } from '@/entities/inventory/model/types'
import DataTable from '@/shared/ui/DataTable/ui/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSelectedRows,
    resetSelectedRows,
    toggleSelectedRow,
} from '@/shared/model/table/model/tableSlice'
import { RootState } from '@/app/providers/StoreProvider/store'
import { allowedUserColumns } from './columns'
import { IAllowedUserList } from '../model/types'
import { Section } from '@/shared/ui/Section'
import { RowSelectionState } from '@tanstack/react-table'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { useAllowedUserActions } from '../lib/useAllowedUserAction'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import { useParams } from 'react-router-dom'
import { useGetInventoryQuery } from '@/entities/inventory/api/inventoryApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'

const initialAllowedUser: TAllowedUser = {
    id: 0,
    name: '',
    email: '',
}

const AllowedUserList = ({ tableId }: IAllowedUserList) => {
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
        onDeleteState:
            !Object.keys(selectedRows).length || (!isAdmin && !isOwner),
    })

    return (
        <Section>
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
