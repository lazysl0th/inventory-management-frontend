import { IItemListItem } from '@/entities/item/model/types'
import { ColumnDef } from '@tanstack/react-table'

export const itemBaseColumns: ColumnDef<IItemListItem>[] = [
    { accessorKey: 'customId', header: 'Custom Id' },
]
