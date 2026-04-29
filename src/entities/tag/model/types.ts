export interface ITag {
    id: number | string
    name: string
    _count: {
        inventories: number
    }
}