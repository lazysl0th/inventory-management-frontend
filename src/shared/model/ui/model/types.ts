import { IUpdateInventoryData } from '@/entities/inventory/model/types'

export enum AppModals {
    Help = 'modal:help',
    AdditionalInfo = 'modal:additionalInfo',
    VersionConflict = 'modal:version',
    None = 'modal:none',
}

interface IToast {
    show: boolean
    header?: string
    message: string
}

export interface IModal {
    name: AppModals
    payload?: IUpdateInventoryData
}

export interface IUiState {
    modal: IModal
    toast: IToast
}

export type TToastPayload = Omit<IToast, 'show'>