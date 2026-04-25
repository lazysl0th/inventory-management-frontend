import { baseApi } from '@/shared/api'
import {
    IAdditionalData,
    ICloudinaryApiResponse,
    IGetInfoResponse,
    ILocations,
    IUploadResultDropbox,
} from '../model/types'
import { ISupportRequestForm } from '@/widgets/SupportRequestForm/model/types'

export const integrationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation<ICloudinaryApiResponse, FormData>({
            query: (body) => ({
                url: 'integration/cloudinary',
                method: 'POST',
                body,
            }),
        }),
        getAddress: builder.query<ILocations, void>({
            query: () => 'integration/salesForce/address',
        }),
        addAdditionInfo: builder.mutation<IGetInfoResponse, IAdditionalData>({
            query: ({ userId, ...body }) => ({
                url: `integration/salesForce/addInfo/${userId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Info'],
        }),
        getAdditionInfo: builder.query<
            IGetInfoResponse,
            Pick<IAdditionalData, 'userId'>
        >({
            query: ({ userId }) => ({
                url: `integration/salesForce/getInfo/${userId}`,
                method: 'POST',
            }),
            providesTags: ['Info'],
        }),
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

export const {
    useUploadImageMutation,
    useGetAddressQuery,
    useAddAdditionInfoMutation,
    useGetAdditionInfoQuery,
    useSendSupportRequestMutation,
} = integrationApi
