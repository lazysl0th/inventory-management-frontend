import { IInventoryList } from '../model/types'
import { Alert, Spinner } from 'react-bootstrap'
import { Section } from '@/shared/ui/Section'
import { DataTable, Typename } from '@/shared/ui/DataTable'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/providers/StoreProvider/store'
import { RowSelectionState } from '@tanstack/react-table'
import { skipToken } from '@reduxjs/toolkit/query'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { getSelectedRows, toggleSelectedRow } from '@/shared/model/table'
import {
    inventoryColumns,
    TInventoryListItem,
    useDeleteInventoriesMutation,
    useGetInventoriesQuery,
    useInventoryActions,
    useSearchInventoriesQuery,
} from '@/entities/inventory'

const InventoryList = ({
    actionButtons,
    requestParams,
    searchParam,
    tableId,
    children,
}: IInventoryList) => {
    const dispatch = useDispatch()

    const {
        data: inventories,
        isLoading: inventoriesIsLoading,
        error: inventoriesError,
    } = useGetInventoriesQuery(requestParams ?? skipToken)

    const {
        data: searchResult,
        isLoading: searchIsLoading,
        error: searchError,
    } = useSearchInventoriesQuery(searchParam ?? skipToken)

    const [deleteInventories] = useDeleteInventoriesMutation()

    const selectedRows = tableId
        ? useSelector((state: RootState) => getSelectedRows(state, tableId))
        : {}

    const selectRowHandle = (selectedRows: RowSelectionState) => {
        tableId && dispatch(toggleSelectedRow({ tableId, selectedRows }))
    }

    const { openRecord, addRecord, deleteRecords, selectedRecords } =
        useRecordHandlers<TInventoryListItem>(Typename.Inventory, {
            tableId,
            onDelete: deleteInventories,
        })

    const inventoryActions = useInventoryActions({
        onAdd: addRecord,
        onDelete: deleteRecords,
        selectedCount: Object.keys(selectedRecords).length,
    })

    return inventoriesIsLoading || searchIsLoading ? (
        <Spinner animation='border' className='align-self-center' />
    ) : inventoriesError || searchError ? (
        <Alert variant='danger' className='align-self-center'>
            {' '}
            {'inventoriesError'}
        </Alert>
    ) : (
        <Section>
            {children}
            {searchParam && searchResult?.length === 0 ? (
                <h2 className='align-self-center'>
                    {'No results found for '}
                    <em>{searchParam.query}</em>
                    {'. Try another search term.'}
                </h2>
            ) : (
                <DataTable<TInventoryListItem, string>
                    tableId={tableId}
                    data={inventories || searchResult || []}
                    columns={inventoryColumns}
                    rowSelection={selectedRows}
                    enableRowSelection={!!tableId}
                    onRowSelectionChange={selectRowHandle}
                    onRowClick={openRecord}
                >
                    {actionButtons && (
                        <ActionButtons
                            actions={inventoryActions}
                            className='d-flex'
                        />
                    )}
                </DataTable>
            )}
        </Section>
    )
}

export default InventoryList
