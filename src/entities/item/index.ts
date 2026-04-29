export {
    default as itemSliceReducer,
    setActiveItem,
    resetActiveItem,
} from './model/itemSlice'
export type {
    IItem,
    IItemListItem,
    IItemForm,
    IUpdateItemData,
    TCreateItemData,
} from './model/types'
export {
    useGetItemsQuery,
    useGetItemQuery,
    useDeleteItemsMutation,
    useCreateItemMutation,
    useUpdateItemMutation,
    useGetLikesQuery,
    useGetLikeQuery,
    useAddLikeMutation,
    useDeleteLikeMutation,
} from './api/itemApi'
