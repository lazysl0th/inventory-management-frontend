import {
    type BaseQueryFn,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { BASE_API, REFRESH_ACCESS_TOKEN } from '../config/constants'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_API,
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) headers.set('authorization', `Bearer ${accessToken}`)
        return headers
    },
    credentials: 'include',
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    REFRESH_ACCESS_TOKEN,
                    api,
                    extraOptions
                )
                if (refreshResult.data) {
                    localStorage.setItem(
                        'accessToken',
                        (refreshResult.data as { accessToken: string })
                            .accessToken
                    )
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch({ type: 'auth/logout' })
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}
