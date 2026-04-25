import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'
import { SETTINGS } from '../config/constants'

const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: Object.values(SETTINGS.tagTypes),
    endpoints: () => ({}),
})

export default baseApi
