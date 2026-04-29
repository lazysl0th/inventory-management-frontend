import { baseApi } from '@/shared/api'
import type {
    IDeleteBody,
    ISearchParam,
    IUpdateBody,
    IUser,
} from '../model/types'

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<IUser[], ISearchParam>({
            query: ({ query }) => ({
                url: 'users',
                params: { query },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: 'User' as const,
                              id,
                          })),
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
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useDeleteUsersMutation,
    useUpdateUsersMutation,
} = adminApi
