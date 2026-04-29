import type { ColumnDef } from '@tanstack/react-table'
import type { TInventoryListItem } from '../model/types'
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useInventoryColumns = () => {
    const { t } = useTranslation('inventory');
    return useMemo<ColumnDef<TInventoryListItem>[]>(() => [
        { accessorKey: 'title', header: t('inventory:listField.title') },
        { accessorKey: 'description', header: t('inventory:listField.description') },
        { accessorKey: 'category', header: t('inventory:listField.category') },
        {
            accessorKey: 'owner',
            header: t('inventory:listField.owner'),
            accessorFn: (row: TInventoryListItem) => row.owner?.name,
        },
    ], [t])
}
