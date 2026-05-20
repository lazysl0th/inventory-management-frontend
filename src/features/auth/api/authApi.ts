import type {
    IAccessToken,
    IAuthResponce,
    IEmailAuthData,
    IRegData,
} from '../model/types'
import { logoutUser } from '../model/authSlice'
import { profileApi } from '@/entities/user/api/profileApi'
import { baseApi } from '@/shared/api'

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginByEmail: builder.mutation<IAuthResponce, IEmailAuthData>({
            query: (body) => ({
                url: '/signin',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.setItem('accessToken', data.accessToken)
                    dispatch(profileApi.util.invalidateTags(['Me']))
                } catch (e) {
                    console.log(e)
                }
            },
        }),
        logout: builder.mutation({
            query: () => '/signout',
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(logoutUser())
                dispatch(baseApi.util.resetApiState())
                localStorage.removeItem('accessToken')
                queryFulfilled.catch(() => {})
            },
        }),
        register: builder.mutation<IAccessToken, IRegData>({
            query: (body) => ({
                url: '/signup',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.setItem('accessToken', data.accessToken)
                    dispatch(profileApi.util.invalidateTags(['Me']))
                } catch (e) {}
            },
        }),
        resetPassword: builder.mutation<{ message: string }, { email: string }>(
            {
                query: (body) => ({
                    url: '/resetpassword',
                    method: 'POST',
                    body,
                }),
            }
        ),
        changePassword: builder.mutation<
            { message: string },
            { password: string }
        >({
            query: (body) => ({
                url: '/changepassword',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const {
    useLoginByEmailMutation,
    useLogoutMutation,
    useRegisterMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi
