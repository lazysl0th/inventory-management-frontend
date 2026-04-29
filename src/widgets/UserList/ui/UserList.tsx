import { Section } from '@/shared/ui/Section'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/providers/StoreProvider/store'
import {
    getSelectedRows,
    toggleSelectedRow,
} from '@/shared/model/table/model/tableSlice'
import { RowSelectionState } from '@tanstack/react-table'
import type { IUserList } from '../model/types'
import { Loader } from '@/shared/ui/Loader'
import { Message } from '@/shared/ui/Message'
import type { IUser } from '@/entities/user'
import useEntityNavigation from '@/shared/lib/hooks/useEntityNavigation'
import { lazy, Suspense } from 'react'
import { useUserColumns } from '@/entities/user/lib/useUserColumns'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import { TableSkeleton } from '@/shared/ui/TableSkeleton'

const ActionMenu = lazy(() =>
    import('@/shared/ui/ActionMenu').then((module) => ({
        default: module.ActionMenu,
    }))
)

const UserList = ({
    data,
    isLoading,
    error,
    tableId,
    children,
    userActions,
}: IUserList) => {
    const dispatch = useDispatch()

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const { open } = useEntityNavigation<IUser>()

    const openRecordHandler = (id: number) => open(Typename.User, id)

    const userColumns = useUserColumns()

    return (
        <Section>
            {children}
            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : error ? (
                <Message
                    error={error}
                    variant='danger'
                    className='align-self-center'
                />
            ) : (
                <DataTable<IUser, string>
                    tableId={tableId}
                    data={data}
                    columns={userColumns}
                    enableRowSelection={!!tableId}
                    rowSelection={selectedRows}
                    onRowSelectionChange={selectRowHandle}
                    onRowClick={openRecordHandler}
                >
                    {userActions && (
                        <Suspense fallback={<Loader />}>
                            <ActionButtons
                                actions={userActions}
                                className='d-flex'
                            />
                            <ActionMenu
                                actions={userActions}
                                className='d-sm-none'
                            />
                        </Suspense>
                    )}
                </DataTable>
            )}
        </Section>
    )
}

export default UserList
