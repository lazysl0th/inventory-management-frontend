import { createSlice } from '@reduxjs/toolkit'
import { userApi } from '../../../entities/user/api/userApi'
import { IAuthState } from './types'
import { authApi } from '../api/authApi'

const initialState: IAuthState = {
    isAuthChecked: false,
    isAuthenticated: false,
    loginUserError: null,
    loginUserRequest: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: () => initialState,
    },
    selectors: {
        getIsAuthenticated: (state) => state.isAuthenticated,
        getIsAuthChecked: (state) => state.isAuthChecked,
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.loginByEmail.matchPending,
            (state) => {
                state.loginUserRequest = true
                state.loginUserError = null
            }
        )
        builder.addMatcher(
            authApi.endpoints.loginByEmail.matchRejected,
            (state, action) => {
                state.loginUserRequest = false
                state.loginUserError = action.payload ?? null
                state.isAuthChecked = true
            }
        )
        builder.addMatcher(
            authApi.endpoints.loginByEmail.matchFulfilled,
            (state) => {
                state.loginUserRequest = false
                state.isAuthenticated = true
                state.isAuthChecked = true
            }
        )
        builder.addMatcher(
            userApi.endpoints.getUserProfile.matchFulfilled,
            (state) => {
                state.loginUserRequest = false
                state.isAuthenticated = true
                state.isAuthChecked = true
            }
        )
        builder.addMatcher(
            userApi.endpoints.getUserProfile.matchRejected,
            (state, action) => {
                state.loginUserRequest = false
                state.loginUserError = action.payload ?? null
                state.isAuthChecked = true
            }
        )
    },
})

export const { getIsAuthenticated, getIsAuthChecked } = authSlice.selectors
export const { logoutUser } = authSlice.actions
export default authSlice.reducer
