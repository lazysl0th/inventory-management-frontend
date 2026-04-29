import type { IAdditionalInfoForm } from '@/widgets/AdditionalInfoForm/model/types'

export interface ICloudinaryApiResponse {
    url: string
}

export interface IPicklistValue {
    value: string
    label: string
    active: boolean
    validFor: string
}

export interface ILocations {
    countries: IPicklistValue[]
    states: IPicklistValue[]
}

export interface IAdditionalData extends Partial<IAdditionalInfoForm> {
    userId: number | string
}

export interface IGetInfoResponse {
    totalSize: number
    done: boolean
    records: IAdditionalData[]
}

export interface IUploadResultDropbox {
    name: string
    path_lower: string
    path_display: string
    id: string
    client_modified: string
    server_modified: string
    rev: string
    size: number
    is_downloadable: boolean
    content_hash: string
}
