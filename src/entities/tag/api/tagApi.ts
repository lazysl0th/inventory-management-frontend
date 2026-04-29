import { baseApi } from '@/shared/api'
import type { ITag } from '../model/types'

export const tagApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<ITag[], void>({
            query: () => 'tags',
        }),
    }),
})

export const { useGetTagsQuery } = tagApi
