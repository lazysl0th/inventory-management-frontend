import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RowSelectionState } from '@tanstack/react-table'

export type TTableIds =
    | 'myInventories'
    | 'allInventories'
    | 'allowedUsers'
    | 'items'
    | 'users'

interface ITableProps {
    selectedRows: RowSelectionState
}

type TTableState = Record<TTableIds, ITableProps>

const initialState: TTableState = {
    allInventories: {
        selectedRows: {},
    },
    myInventories: {
        selectedRows: {},
    },
    allowedUsers: {
        selectedRows: {},
    },
    items: {
        selectedRows: {},
    },
    users: {
        selectedRows: {},
    },
}

type PayloadToggleSelectedRow = {
    tableId: TTableIds
    selectedRows: RowSelectionState
}

const tableSlice = createSlice({
    name: 'table',
    initialState,
    selectors: {
        getSelectedRows: (state, tableId: TTableIds) =>
            state[tableId].selectedRows,
    },
    reducers: {
        toggleSelectedRow: (
            state,
            action: PayloadAction<PayloadToggleSelectedRow>
        ) => {
            state[action.payload.tableId].selectedRows =
                action.payload.selectedRows
        },
        resetSelectedRows: (state, action: PayloadAction<TTableIds>) => {
            state[action.payload].selectedRows = {}
        },
    },
})

export const { toggleSelectedRow, resetSelectedRows } = tableSlice.actions
export const { getSelectedRows } = tableSlice.selectors
export default tableSlice.reducer
