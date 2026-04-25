import { baseApi } from '@/shared/api'

export interface ITag {
    id: number | string
    name: string
    _count: {
        inventories: number
    }
}

export const tagApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<ITag[], void>({
            query: () => 'tags',
        }),
    }),
})

export const { useGetTagsQuery } = tagApi
