import { baseApi } from '@/shared/api'
import {
    IDeleteBody,
    IInventoriesRequestParams,
    IInventory,
    IInventorySearchParam,
    ISelectParam,
    IUpdateInventoryData,
    TCategory,
    TCreateInventoryData,
    TInventoryListItem,
} from '../model/types'

export const inventoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        searchInventories: builder.query<
            TInventoryListItem[],
            IInventorySearchParam
        >({
            query: ({ query }) => ({
                url: 'inventories/search',
                params: { query },
            }),
            providesTags: ['Inventory'],
        }),
        getInventories: builder.query<
            TInventoryListItem[],
            IInventoriesRequestParams
        >({
            query: ({ sort, ownerId, allowedUserId, isPublic }) => ({
                url: 'inventories',
                params: { sort, ownerId, allowedUserId, isPublic },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: 'Inventory' as const,
                              id,
                          })),
                          'Inventory',
                      ]
                    : ['Inventory'],
        }),
        getInventory: builder.query<Required<IInventory>, ISelectParam>({
            query: ({ inventoryId }) => `inventories/${inventoryId}`,
            providesTags: (result, error, { inventoryId }) => [
                { type: 'Inventory', id: inventoryId },
            ],
        }),
        getInventoryCategories: builder.query<TCategory[], void>({
            query: () => 'inventories/categories',
        }),
        deleteInventories: builder.mutation<{ count: number }, string[]>({
            query: (inventoryIds) => ({
                url: 'inventories',
                method: 'DELETE',
                body: { inventoryIds } satisfies IDeleteBody,
            }),
            invalidatesTags: ['Inventory'],
        }),
        createInventory: builder.mutation<
            Required<IInventory>,
            TCreateInventoryData
        >({
            query: (body) => ({
                url: 'inventories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Inventory'],
        }),
        updateInventory: builder.mutation<
            IInventory,
            Partial<IUpdateInventoryData>
        >({
            query: ({ id: inventoryId, ...body }) => ({
                url: `inventories/${inventoryId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Inventory', id },
                'Inventory',
            ],
        }),
        getInventoryToken: builder.query<string, ISelectParam>({
            query: ({ inventoryId }) => `inventories/${inventoryId}/getToken`,
        })
    }),
})

export const {
    useSearchInventoriesQuery,
    useGetInventoriesQuery,
    useLazyGetInventoryQuery,
    useGetInventoryQuery,
    useGetInventoryCategoriesQuery,
    useDeleteInventoriesMutation,
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useLazyGetInventoryTokenQuery
} = inventoryApi
