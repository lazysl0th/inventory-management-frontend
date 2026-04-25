import { ColumnDef } from '@tanstack/react-table'
import { TInventoryListItem } from '../model/types'

export const inventoryColumns: ColumnDef<TInventoryListItem>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'category', header: 'Category' },
    {
        accessorKey: 'owner',
        header: 'Owner',
        accessorFn: (row: TInventoryListItem) => row.owner?.name,
    },
]
