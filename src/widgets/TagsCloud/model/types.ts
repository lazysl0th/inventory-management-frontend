import type { ITag } from '@/entities/tag'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export interface ITagsCloudProps {
    data: ITag[]
    isLoading: boolean
    error?: FetchBaseQueryError | SerializedError
    minFontSize: number
    maxFontSize: number
}
