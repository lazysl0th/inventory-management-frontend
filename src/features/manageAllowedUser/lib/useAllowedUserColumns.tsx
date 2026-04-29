import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { TAllowedUser } from '@/entities/inventory/model/types'
import { AllowedUsersField } from '@/widgets/AllowedUsersField'
import type { ColumnDef } from '@tanstack/react-table'

export const useAllowedUserColumns = () => {
    const { t } = useTranslation('inventory');

    return useMemo<ColumnDef<TAllowedUser>[]>(() => [
        { accessorKey: 'name', header: t('inventory:listField.name') },
        {
            accessorKey: 'email',
            header: t('inventory:listField.email'),
            cell: ({ row }) => <AllowedUsersField name={`allowedUsers[${row.index}]`} />,
            enableResizing: false,
        },
    ], [t])
}
