import { baseApi } from '@/shared/api'

interface IRoleBody {
    userIds: string[]
    roleIds: number[]
}

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addRoles: builder.mutation<{ count: number }, IRoleBody>({
            query: (body) => ({
                url: '/roles',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        deleteRoles: builder.mutation<{ count: number }, IRoleBody>({
            query: (body) => ({
                url: '/roles',
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const { useAddRolesMutation, useDeleteRolesMutation } = roleApi
