import type { ITag } from '@/entities/tag'
import type { IUser } from '@/entities/user'

export enum Category {
    Equipment = 'Equipment',
    Furniture = 'Furniture',
    Book = 'Book',
    Other = 'Other',
    None = '',
}

export type TTag = Omit<ITag, '_count'>

export enum InventoryFieldType {
    Text = 'TEXT',
    LongText = 'LONGTEXT',
    Number = 'NUMBER',
    File = 'FILE',
    Boolean = 'BOOLEAN',
}

export interface IField {
    id: number | string
    title: string
    description?: string
    inventoryId?: number
    type: InventoryFieldType | null
    showInTable: boolean
    isDeleted: boolean
    order: number
    isNew?: boolean
}

export enum PartIdTypes {
    Text = 'TEXT',
    Random20BitNumber = 'RANDOM20',
    Random32BitNumber = 'RANDOM32',
    Random6Digits = 'RANDOM6',
    Random9Digits = 'RANDOM9',
    Guid = 'GUID',
    DateTime = 'DATETIME',
    Sequence = 'SEQUENCE',
}

export enum PartIdFormat {
    D1 = 'D1',
    D2 = 'D2',
    D3 = 'D3',
    D4 = 'D4',
    D6 = 'D6',
    D9 = 'D9',
    D10 = 'D10',
    X8 = 'X8',
    X5 = 'X5',
    YYYY = 'YYYY',
    YYYYMM = 'YYYYMM',
    YYYYMMDD = 'YYYYMMDD',
    YYYYMMDDHHmm = 'YYYYMMDD-HHmm',
    YYYYMMDDHHmmss = 'YYYYMMDD-HHmmss',
}

export enum SeparatorPosition {
    Prefix = 'prefix',
    Suffix = 'suffix',
}

export interface IPartId {
    guid: string
    type: PartIdTypes | null
    format: PartIdFormat | null
    order: number
    separator: string
    position: SeparatorPosition | null
    value: string
    currentSequence: string
}

export interface ICustomIdFormat {
    parts: IPartId[]
    summary: string
}

export type TAllowedUser = Pick<IUser, 'id' | 'email' | 'name'> & {
    order?: number
}

export interface IActiveInventory {
    id: number | null
}

export interface IInventory {
    id?: number
    title: string
    description: string
    category: Category
    owner: IUser | null
    image: string
    customIdFormat: ICustomIdFormat
    fields: IField[]
    isPublic: boolean
    token: string
    allowedUsers: TAllowedUser[]
    createdAt: string
    updatedAt: string
    version: number
    tags: TTag[]
}

export interface IInventoryForm extends Omit<IInventory, 'owner'> {
    owner: string
}

export type TInventoryListItem = Required<
    Pick<IInventory, 'id' | 'title' | 'description' | 'category' | 'owner'>
>

export interface IInventoriesState {
    activeInventory: IActiveInventory
}

export type TCategory = Exclude<Category, Category.None>

export enum EnumInventorySortOrders {
    Latest = 'latest',
    TopItems = 'topItems',
}

interface IFilterParams {
    ownerId?: number
    allowedUserId?: number
    isPublic?: boolean
}

export interface IInventoriesRequestParams extends IFilterParams {
    sort?: EnumInventorySortOrders
}

export interface IInventorySearchParam {
    query: string
}

export interface ISelectParam {
    inventoryId: string
}

export interface IDeleteBody {
    inventoryIds: string[]
}

export type TCreateInventoryData = Omit<
    IInventory,
    'createdAt' | 'updatedAt' | 'token' | 'owner'
>

export interface IUpdateInventoryData extends Omit<
    TCreateInventoryData,
    'fields'
> {
    fields: Partial<IField>[]
}

export interface IUseInventoryActionsProps {
    onAdd: () => void
    onDelete: () => void
    selectedCount: number
}
