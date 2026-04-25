import { TAllowedUser } from '@/entities/inventory/model/types'
import { AllowedUsersField } from '@/widgets/AllowedUsersField'

import { CellContext, ColumnDef } from '@tanstack/react-table'

const editableCell = <TData, TValue>(info: CellContext<TData, TValue>) => {
    return <AllowedUsersField name={`allowedUsers[${info.row.index}]`} />
}

export const allowedUserColumns: ColumnDef<TAllowedUser>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: editableCell,
        enableResizing: false,
    },
]
