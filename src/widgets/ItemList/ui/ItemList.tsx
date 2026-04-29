import { skipToken } from '@reduxjs/toolkit/query'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import type { IItemList } from '../model/types'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/providers/StoreProvider/store'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { Section } from '@/shared/ui/Section'
import {
    type IItem,
    type IItemListItem,
    useDeleteItemsMutation,
    useGetItemsQuery,
} from '@/entities/item'
import { getSelectedRows, toggleSelectedRow } from '@/shared/model/table'
import { Loader } from '@/shared/ui/Loader'
import { Message } from '@/shared/ui/Message'
import { useItemColumns } from '../lib/useItemColumns'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'
import { getItemColumns } from '@/entities/item/lib/getItemColumns'
import { useItemActions } from '@/entities/item/lib/useItemActions'
import { TableSkeleton } from '@/shared/ui/TableSkeleton'

const ItemList = ({ tableId }: IItemList) => {
    const dispatch = useDispatch()

    const { data: inventory, inventoryId } = useInventoryData()

    const {
        data: items = [],
        isLoading,
        error,
    } = useGetItemsQuery(
        inventoryId && !isNaN(Number(inventoryId)) ? { inventoryId } : skipToken
    )

    const { isAdmin, isOwner, hasWriteAccess } = useInventoryAccess(inventory)

    const itemColumns: ColumnDef<IItemListItem, string>[] = getItemColumns(
        inventory?.fields
    )

    const [deleteItems] = useDeleteItemsMutation()

    const deleteItemsHandler = (
        itemIds: string[]
    ): Promise<{ count: number }> => {
        if (!inventoryId) throw new Error('Отсутствует идентификатор инвентаря')
        return deleteItems({ inventoryId, itemIds }).unwrap()
    }

    const { openRecord, addRecord, deleteRecords, selectedRecords } =
        useRecordHandlers<IItem>(Typename.Item, {
            tableId,
            onDelete: deleteItemsHandler,
        })

    const itemActions = useItemActions({
        onAdd: addRecord,
        onDelete: deleteRecords,
        onAddState: !isAdmin && !isOwner && !hasWriteAccess,
        onDeleteState: !isAdmin && !isOwner && !hasWriteAccess,
        selectedCount: Object.keys(selectedRecords).length,
    })

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const itemBaseColumns = useItemColumns()

    return (
        <Section>
            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : error ? (
                <Message
                    error={error}
                    variant='danger'
                    className='align-self-center'
                />
            ) : (
                <DataTable<IItemListItem, string>
                    tableId={tableId}
                    data={items}
                    columns={[...itemBaseColumns, ...itemColumns]}
                    rowSelection={selectedRows}
                    enableRowSelection={
                        !isAdmin && !isOwner && !hasWriteAccess ? false : true
                    }
                    onRowSelectionChange={selectRowHandle}
                    onRowClick={openRecord}
                >
                    <ActionButtons actions={itemActions} className='d-flex' />
                </DataTable>
            )}
        </Section>
    )
}

export default ItemList
