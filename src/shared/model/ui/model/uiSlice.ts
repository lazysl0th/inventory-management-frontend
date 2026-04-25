import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppModals, IModal, IUiState, TToastPayload } from './types'

const initialModalState = {
    name: AppModals.None,
}

const initialToastState = {
    show: false,
    message: '',
}

const initialState: IUiState = {
    modal: initialModalState,
    toast: initialToastState,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    selectors: {
        getModal: (state) => state.modal,
        getToast: (state) => state.toast,
    },
    reducers: {
        openModal: (state, action: PayloadAction<IModal>) => {
            state.modal = action.payload
        },
        closeModal: (state) => {
            state.modal.name = AppModals.None
            state.modal.payload = undefined
        },
        showToast: (state, action: PayloadAction<TToastPayload>) => {
            state.toast.show = true
            state.toast.header = action.payload.header
            state.toast.message = action.payload.message
        },
        hideToast: (state) => {
            state.toast = initialToastState
        },
    },
})

export const { openModal, closeModal, showToast, hideToast } = uiSlice.actions
export const { getModal, getToast } = uiSlice.selectors
export default uiSlice.reducer
