import { IField, InventoryFieldType } from '@/entities/inventory/model/types'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { IItemListItem } from '../model/types'
import { FaCheck } from 'react-icons/fa'
import { GiCancel } from 'react-icons/gi'

export const getItemColumns = (
    fields?: IField[]
): ColumnDef<IItemListItem, string>[] => {
    return (
        fields
            ?.filter((field) => field.showInTable === true)
            .toSorted((a, b) => a.order - b.order)
            .map((field) => ({
                accessorKey: String(field.id),
                header: field.title,
                accessorFn: (row: IItemListItem) => {
                    const itemValue = row.values.find(
                        (value) => value.field.id === field.id
                    )
                    return itemValue?.value ?? ''
                },
                meta: {
                    align:
                        field.type === InventoryFieldType.Boolean
                            ? 'center'
                            : 'left',
                },
                cell: ({ getValue }: CellContext<IItemListItem, string>) => {
                    const val = getValue()
                    const isBoolean = field.type === InventoryFieldType.Boolean
                    return (
                        <div
                            className={`d-flex w-100 ${isBoolean ? 'justify-content-center' : ''}`}
                        >
                            {isBoolean ? (
                                val === 'true' ? (
                                    <FaCheck className='text-success' />
                                ) : (
                                    <GiCancel className='text-danger' />
                                )
                            ) : (
                                val
                            )}
                        </div>
                    )
                },
            })) ?? []
    )
}
