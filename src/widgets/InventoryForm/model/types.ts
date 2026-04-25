import { IField, IPartId, PartIdFormat } from '@/entities/inventory'

export type TDateTimeFormats = Extract<
    PartIdFormat,
    | PartIdFormat.YYYY
    | PartIdFormat.YYYYMM
    | PartIdFormat.YYYYMMDD
    | PartIdFormat.YYYYMMDDHHmm
    | PartIdFormat.YYYYMMDDHHmmss
>
export type TSequenceFormats = Extract<
    PartIdFormat,
    PartIdFormat.D1 | PartIdFormat.D2 | PartIdFormat.D3 | PartIdFormat.D4
>
export type TRandom9DigitFormat = Extract<PartIdFormat, PartIdFormat.D9>
export type TRandom6DigitFormat = Extract<PartIdFormat, PartIdFormat.D6>
export type TRandom32BitNumberFormats = Extract<
    PartIdFormat,
    PartIdFormat.D10 | PartIdFormat.X8
>
export type TRandom20BitNumberFormats = Extract<
    PartIdFormat,
    PartIdFormat.D6 | PartIdFormat.X5
>

export interface PartIdSettings {
    label: string
    formats: Partial<Record<PartIdFormat, string>> | string | null
    hint: string
    formatHint: string
}

export interface IPartIdFieldsetProps {
    partId: IPartId
    index: number
}

export interface IUseFieldsetActionsProps {
    onMoveUp: () => void
    onMoveDown: () => void
    onDelete: () => void
}

export interface IFieldFieldsetProps {
    field: IField
}

export enum InventoryTabs {
    Details = 'details',
    CustomId = 'customId',
    Fields = 'fields',
    Access = 'access',
}

export interface IDragDropHandlers {
    deleteHandler: (ids: (string | number)[]) => void
    sortHandler: (initialIndex: number, index: number) => void
}
