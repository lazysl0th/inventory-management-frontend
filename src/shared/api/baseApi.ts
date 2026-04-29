import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'
import { TAG_TYPES_LIST } from './tagTypes'

const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: TAG_TYPES_LIST,
    endpoints: () => ({}),
})

export default baseApi
