import { skipToken } from '@reduxjs/toolkit/query'
import { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import { itemBaseColumns } from './columns'
import { IItemList } from '../model/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/providers/StoreProvider/store'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { Section } from '@/shared/ui/Section'
import { useInventoryAccess, useInventoryData } from '@/entities/inventory'
import {
    getItemColumns,
    IItem,
    IItemListItem,
    useDeleteItemsMutation,
    useGetItemsQuery,
    useItemActions,
} from '@/entities/item'
import { getSelectedRows, toggleSelectedRow } from '@/shared/model/table'

const ItemList = ({ tableId }: IItemList) => {
    const dispatch = useDispatch()

    const { data: inventory, inventoryId } = useInventoryData()

    const {
        data: items = [],
        isLoading: itemsIsLoading,
        error: itemsError,
        isSuccess: itemsIsSuccess,
    } = useGetItemsQuery(
        inventoryId && !isNaN(Number(inventoryId)) ? { inventoryId } : skipToken
    )

    const { isAdmin, isOwner, hasWriteAccess } = useInventoryAccess(inventory)

    const itemColumns: ColumnDef<IItemListItem, string>[] = getItemColumns(
        inventory?.fields
    )

    const [deleteItems] = useDeleteItemsMutation()

    const deleteItemsHandler = (itemIds: string[]) => {
        if (!inventoryId) return
        deleteItems({ inventoryId, itemIds })
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
        onDeleteState:
            !Object.keys(selectedRecords).length ||
            (!isAdmin && !isOwner && !hasWriteAccess),
    })

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    return (
        <Section>
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
        </Section>
    )
}

export default ItemList
