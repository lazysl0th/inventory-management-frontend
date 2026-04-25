import { baseApi } from '@/shared/api'
import { ISupportRequestForm, IUploadResultDropbox } from '../model/types'

export const supportRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendSupportRequest: builder.mutation<
            IUploadResultDropbox,
            ISupportRequestForm
        >({
            query: (body) => ({
                url: `integration/dropbox`,
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const { useSendSupportRequestMutation } = supportRequestApi
