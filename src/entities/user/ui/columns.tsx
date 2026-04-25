import { ColumnDef } from '@tanstack/react-table'
import { IUser } from '../model/types'

export const userColumns: ColumnDef<IUser>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status' },
    {
        accessorKey: 'roles',
        header: 'Roles',
        accessorFn: (row: IUser) =>
            row.roles.map((role) => role.role?.name).join(', ') || '-',
    },
]
