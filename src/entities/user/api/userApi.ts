import { baseApi } from '@/shared/api'
import { IDeleteBody, ISearchParam, IUpdateBody, IUser } from '../model/types'

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUser, void>({
            query: () => 'users/me',
            providesTags: ['Me'],
        }),
        getUser: builder.query<IUser, string>({
            query: (userId) => `users/${userId}`,
            providesTags: (result, error, userId) => [
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
        getUsers: builder.query<IUser[], ISearchParam>({
            query: ({ query }) => ({
                url: 'users',
                params: { query },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'User', id })),
                          'User',
                      ]
                    : ['User'],
        }),
        deleteUsers: builder.mutation<{ count: number }, string[]>({
            query: (userIds) => ({
                url: 'users',
                method: 'DELETE',
                body: { userIds } satisfies IDeleteBody,
            }),
            invalidatesTags: ['User'],
        }),
        updateUsers: builder.mutation<{ count: number }, IUpdateBody<IUser>>({
            query: (body) => ({
                url: 'users',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const {
    useGetUserProfileQuery,
    useLazyGetUserProfileQuery,
    useGetUsersQuery,
    useGetUserQuery,
    useLazyGetUsersQuery,
    useDeleteUsersMutation,
    useUpdateUsersMutation,
    useUpdateUserMutation,
} = userApi
