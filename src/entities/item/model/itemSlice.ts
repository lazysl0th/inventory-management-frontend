import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IActiveItem, IItemState } from './types'

const initialState: IItemState = {
    activeItem: {
        id: null,
    },
}

const itemSlice = createSlice({
    name: 'item',
    initialState,
    selectors: {
        getActiveItem: (state) => state.activeItem,
    },
    reducers: {
        setActiveItem: (state, action: PayloadAction<IActiveItem>) => {
            state.activeItem.id = action.payload.id
        },
        resetActiveItem: (state) => {
            state.activeItem.id = null
        },
    },
})

export const { setActiveItem, resetActiveItem } = itemSlice.actions
export const { getActiveItem } = itemSlice.selectors
export default itemSlice.reducer
