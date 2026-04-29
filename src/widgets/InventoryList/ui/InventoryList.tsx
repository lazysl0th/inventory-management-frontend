import type { IInventoryList } from '../model/types'
import { Section } from '@/shared/ui/Section'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/providers/StoreProvider/store'
import type { RowSelectionState } from '@tanstack/react-table'
import { getSelectedRows, toggleSelectedRow } from '@/shared/model/table'
import type { TInventoryListItem } from '@/entities/inventory'
import { Loader } from '@/shared/ui/Loader'
import { Message } from '@/shared/ui/Message'
import { useInventoryColumns } from '@/entities/inventory/lib/useInventoryColumns'
import { Suspense } from 'react'
import useEntityNavigation from '@/shared/lib/hooks/useEntityNavigation'
import { TableSkeleton } from '@/shared/ui/TableSkeleton'
import { ActionButtons } from '@/shared/ui/ActionButtons'

const InventoryList = ({
    data,
    isLoading,
    error,
    tableId,
    children,
    inventoryActions,
}: IInventoryList) => {
    const dispatch = useDispatch()

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const inventoryColumns = useInventoryColumns()

    const { open } = useEntityNavigation<TInventoryListItem>()

    const openRecordHandler = (id: number) => open(Typename.Inventory, id)

    return (
        <Section>
            {children}
            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : error ? (
                <Message variant='danger' error={error} />
            ) : (
                <DataTable<TInventoryListItem, string>
                    tableId={tableId}
                    data={data}
                    columns={inventoryColumns}
                    rowSelection={selectedRows}
                    enableRowSelection={!!tableId}
                    onRowSelectionChange={selectRowHandle}
                    onRowClick={openRecordHandler}
                >
                    {inventoryActions && (
                        <Suspense fallback={<Loader />}>
                            <ActionButtons
                                actions={inventoryActions}
                                className='d-flex'
                            />
                        </Suspense>
                    )}
                </DataTable>
            )}
        </Section>
    )
}

export default InventoryList
