import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserState } from './types'
import { userApi } from '../api/userApi'

const initialState: IUserState = {
    currentUser: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    selectors: {
        getCurrentUser: (state) => state.currentUser,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            userApi.endpoints.getUserProfile.matchFulfilled,
            (state, action: PayloadAction<IUser>) => {
                state.currentUser = action.payload
            }
        )
        builder.addMatcher(
            userApi.endpoints.getUserProfile.matchRejected,
            (state) => {
                state.currentUser = null
            }
        )
    },
})

export const { getCurrentUser } = userSlice.selectors
export default userSlice.reducer
