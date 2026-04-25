import { Alert, Spinner } from 'react-bootstrap'
import { Section } from '@/shared/ui/Section'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/providers/StoreProvider/store'
import {
    getSelectedRows,
    toggleSelectedRow,
} from '@/shared/model/table/model/tableSlice'
import { RowSelectionState } from '@tanstack/react-table'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { IUserList } from '../model/types'
import {
    useDeleteUsersMutation,
    useGetUsersQuery,
    useUpdateUsersMutation,
} from '@/entities/user/api/userApi'
import { useUserActions } from '@/entities/user/lib/useUserActions'
import { IUser } from '@/entities/user/model/types'
import { ActionMenu } from '@/shared/ui/ActionMenu'
import { userColumns } from '@/entities/user/ui/columns'
import { useAddRolesMutation, useDeleteRolesMutation } from '@/features/role'

const UserList = ({ tableId, children }: IUserList) => {
    const dispatch = useDispatch()

    const {
        data: users = [],
        isLoading: usersIsLoading,
        error: usersError,
    } = useGetUsersQuery({})

    const [deleteUsers] = useDeleteUsersMutation()
    const [updateUsers] = useUpdateUsersMutation()
    const [addRoles] = useAddRolesMutation()
    const [deleteRoles] = useDeleteRolesMutation()

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const {
        openRecord,
        deleteRecords,
        updateRecords,
        grantRecords,
        revokeRecords,
        selectedRecords,
    } = useRecordHandlers<IUser>(Typename.User, {
        tableId: 'users',
        onDelete: deleteUsers,
        onUpdate: updateUsers,
        onGrant: addRoles,
        onRevoke: deleteRoles,
    })

    const userActions = useUserActions({
        onBlock: () => updateRecords({ status: 'Blocked' }),
        onUnblock: () => updateRecords({ status: 'Active' }),
        onGrant: () => grantRecords([1]),
        onRevoke: () => revokeRecords([1]),
        onDelete: deleteRecords,
        selectedCount: Object.keys(selectedRecords).length,
    })

    return usersIsLoading ? (
        <Spinner animation='border' className='align-self-center' />
    ) : usersError ? (
        <Alert variant='danger' className='align-self-center'>
            {' '}
            {'inventoriesError'}
        </Alert>
    ) : (
        <Section>
            {children}
            <DataTable<IUser, string>
                tableId={tableId}
                data={users}
                columns={userColumns}
                enableRowSelection={!!tableId}
                rowSelection={selectedRows}
                onRowSelectionChange={selectRowHandle}
                onRowClick={openRecord}
            >
                <ActionButtons
                    actions={userActions}
                    className='d-none d-sm-flex'
                />
                <ActionMenu actions={userActions} className='d-sm-none' />
            </DataTable>
        </Section>
    )
}

export default UserList
