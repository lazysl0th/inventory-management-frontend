import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RowSelectionState } from '@tanstack/react-table'
import type { TTableIds, TTableState } from './types'

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
