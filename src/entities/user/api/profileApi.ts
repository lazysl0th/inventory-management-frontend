import { baseApi } from '@/shared/api'
import type { IUser } from '../model/types'

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUser, void>({
            query: () => 'users/me',
            providesTags: ['Me'],
        }),
        getUser: builder.query<IUser, string>({
            query: (userId) => `users/${userId}`,
            providesTags: (_, __, userId) => [
                { type: 'User', id: userId },
            ],
        }),
        updateUser: builder.mutation<IUser, Partial<IUser>>({
            query: ({ id: userId, ...body }) => ({
                url: `users/${userId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User', 'Me'],
        }),
    }),
})

export const {
    useGetUserProfileQuery,
    useLazyGetUserProfileQuery,
    useGetUserQuery,
    useUpdateUserMutation,
} = profileApi
