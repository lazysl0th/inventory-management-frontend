import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IUser, IUserState } from './types'
import { profileApi } from '../api/profileApi'

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
            profileApi.endpoints.getUserProfile.matchFulfilled,
            (state, action: PayloadAction<IUser>) => {
                state.currentUser = action.payload
            }
        )
        builder.addMatcher(
            profileApi.endpoints.getUserProfile.matchRejected,
            (state) => {
                state.currentUser = null
            }
        )
    },
})

export const { getCurrentUser } = userSlice.selectors
export default userSlice.reducer
