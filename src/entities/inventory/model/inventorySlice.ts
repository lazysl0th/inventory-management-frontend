import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IActiveInventory, IInventoriesState } from './types'

const initialState: IInventoriesState = {
    activeInventory: {
        id: null,
    },
}

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    selectors: {
        getActiveInventory: (state) => state.activeInventory,
    },
    reducers: {
        setActiveInventory: (
            state,
            action: PayloadAction<Partial<IActiveInventory>>
        ) => {
            state.activeInventory.id = action.payload.id ?? null
        },
        resetActiveInventory: () => initialState,
    },
})

export const { resetActiveInventory, setActiveInventory } =
    inventorySlice.actions
export const { getActiveInventory } = inventorySlice.selectors
export default inventorySlice.reducer
