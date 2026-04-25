import { SETTINGS } from '@/shared/config/constants'
import { IComment, ICommentData, ISelectParam } from '../model/types'
import { baseApi } from '@/shared/api'

export const commentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInventoryComments: builder.query<IComment[], ISelectParam>({
            query: ({ inventoryId }) => ({
                url: `comments/inventories/${inventoryId}`,
            }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const ws = new WebSocket(SETTINGS.urls.wsUrl)

                const channel = `comments:inventoryId=${arg.inventoryId}`

                const sendSubscribe = () => {
                    ws.send(
                        JSON.stringify({
                            type: 'SUBSCRIBE',
                            channel,
                        })
                    )
                }

                const sendUnsubscribe = () => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(
                            JSON.stringify({
                                type: 'UNSUBSCRIBE',
                                channel,
                            })
                        )
                    }
                }

                ws.addEventListener('open', sendSubscribe)

                let listener: ((event: MessageEvent) => void) | undefined

                try {
                    await cacheDataLoaded

                    listener = (event: MessageEvent) => {
                        const data = JSON.parse(event.data)
                        if (/*!isComment(data) ||*/ data.channel !== channel)
                            return
                        updateCachedData((draft) => {
                            draft.push(data.comment)
                        })
                    }

                    ws.addEventListener('message', listener)
                    await cacheEntryRemoved
                } finally {
                    ws.removeEventListener('open', sendSubscribe)
                    if (listener) ws.removeEventListener('message', listener)
                    sendUnsubscribe()
                }
                ws.close()
            },
            providesTags: ['Comment'],
        }),

        createInventoryComment: builder.mutation<
            Required<IComment>,
            ICommentData
        >({
            query: ({ inventoryId, ...body }) => ({
                url: `comments/inventories/${inventoryId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Comment'],
        }),
    }),
})

export const {
    useGetInventoryCommentsQuery,
    useCreateInventoryCommentMutation,
} = commentApi
