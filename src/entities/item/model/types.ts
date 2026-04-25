import { IField } from '@/entities/inventory/model/types'
import { IUser } from '@/entities/user/model/types'

export interface IItemListItem {
    id: number
    customId?: string
    values: IValue[]
}

export interface IItem extends IItemListItem {
    inventoryId: number | null
    createdAt: string
    updatedAt: string
    owner: IUser | null
    //version: number;
}

export interface IInventoryIdParam {
    inventoryId: string
}

export interface ISelectParams extends IInventoryIdParam {
    itemId: string
}

export interface IDeleteBody extends IInventoryIdParam {
    itemIds: (number | string)[]
}

export interface IUpdateItemData extends Omit<
    IItem,
    'createdAt' | 'updatedAt' | 'token' | 'owner' | 'values'
> {
    values: ICreateValue[]
}

export type TCreateItemData = Omit<IUpdateItemData, 'id'>

interface ICreateValue extends Omit<IValue, 'field'> {
    fieldId: number | string
}

export type TLike = {
    id: number
    userId: number
    itemId: number
}

export interface IValue {
    id?: number
    field: IField
    value: string | boolean
}

export interface IItemForm {
    id?: number
    customId: string
    values: IValue[]
    createdAt: string
    updatedAt: string
    owner: string
}

export interface IActiveItem {
    id: number | null
}

export interface IItemState {
    activeItem: IActiveItem
}

export interface UseItemActionsProps {
    onAdd: () => void
    onDelete: () => void
    onAddState: boolean
    onDeleteState: boolean
}
