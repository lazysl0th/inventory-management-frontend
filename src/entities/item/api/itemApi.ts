import { baseApi } from '@/shared/api'
import {
    IDeleteBody,
    IInventoryIdParam,
    IItem,
    IItemListItem,
    ISelectParams,
    IUpdateItemData,
    TCreateItemData,
    TLike,
} from '../model/types'

export const itemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query<IItemListItem[], IInventoryIdParam>({
            query: ({ inventoryId }) => ({
                url: `inventories/${inventoryId}/items/`,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Item', id })),
                          'Item',
                      ]
                    : ['Item'],
        }),
        getItem: builder.query<IItem, ISelectParams>({
            query: ({ inventoryId, itemId }) => ({
                url: `inventories/${inventoryId}/items/${itemId}`,
            }),
            providesTags: (result, error, { itemId }) => [
                { type: 'Item', id: itemId },
            ],
        }),
        deleteItems: builder.mutation<{ count: number }, IDeleteBody>({
            query: ({ inventoryId, itemIds }) => ({
                url: `inventories/${inventoryId}/items`,
                method: 'DELETE',
                body: { itemIds },
            }),
            invalidatesTags: ['Item'],
        }),
        createItem: builder.mutation<Required<IItem>, TCreateItemData>({
            query: ({ inventoryId, ...body }) => ({
                url: `inventories/${inventoryId}/items`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Item'],
        }),
        updateItem: builder.mutation<Required<IItem>, IUpdateItemData>({
            query: ({ inventoryId, id, ...body }) => ({
                url: `inventories/${inventoryId}/items/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Item', id },
                'Item',
            ],
        }),
        getLikes: builder.query<{ count: number }, ISelectParams>({
            query: ({ inventoryId, itemId }) => ({
                url: `inventories/${inventoryId}/items/${itemId}/likes`,
            }),
            providesTags: (result, error, { itemId }) => [
                { type: 'Like', id: itemId },
            ],
        }),
        getLike: builder.query<TLike, ISelectParams>({
            query: ({ inventoryId, itemId }) => ({
                url: `inventories/${inventoryId}/items/${itemId}/like`,
            }),
            providesTags: ['Like'],
        }),
        addLike: builder.mutation<TLike, ISelectParams>({
            query: ({ inventoryId, itemId }) => ({
                url: `inventories/${inventoryId}/items/${itemId}/like`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, { itemId }) => [
                { type: 'Like', id: itemId },
            ],
        }),
        deleteLike: builder.mutation({
            query: ({ inventoryId, itemId }) => ({
                url: `inventories/${inventoryId}/items/${itemId}/like`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { itemId }) => [
                { type: 'Like', id: itemId },
            ],
        }),
    }),
})

export const {
    useGetItemsQuery,
    useGetItemQuery,
    useDeleteItemsMutation,
    useCreateItemMutation,
    useUpdateItemMutation,
    useGetLikesQuery,
    useGetLikeQuery,
    useAddLikeMutation,
    useDeleteLikeMutation,
} = itemApi
