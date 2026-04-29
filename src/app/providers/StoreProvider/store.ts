import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api'

import { authSliceReducer } from '@/features/auth/'
import { inventorySliceReducer } from '@/entities/inventory'
import { itemSliceReducer } from '@/entities/item'
import { userSliceReducer } from '@/entities/user'
import { uiSliceReducer } from '@/shared/model/ui'
import tableSliceReducer from '@/shared/model/table/model/tableSlice'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authSliceReducer,
        inventory: inventorySliceReducer,
        item: itemSliceReducer,
        user: userSliceReducer,
        ui: uiSliceReducer,
        table: tableSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
