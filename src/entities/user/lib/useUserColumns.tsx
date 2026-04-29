import type { ColumnDef } from '@tanstack/react-table'
import type { IUser } from '../model/types'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export const useUserColumns = () => {
    const { t } = useTranslation('user')
    return useMemo<ColumnDef<IUser>[]>(
        () => [
            { accessorKey: 'name', header: t('user:listField.name') },
            { accessorKey: '', header: t('user:listField.email') },
            { accessorKey: 'status', header: t('user:listField.status') },
            {
                accessorKey: 'roles',
                header: t('user:listField.roles'),
                accessorFn: (row: IUser) =>
                    row.roles.map((role) => role.role?.name).join(', ') || '-',
            },
        ],
        [t]
    )
}
