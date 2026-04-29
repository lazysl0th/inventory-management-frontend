import type { IItemListItem } from '@/entities/item/model/types'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

export const useItemColumns = () => {
    const { t } = useTranslation('item')

    return useMemo<ColumnDef<IItemListItem>[]>(
        () => [
            { accessorKey: 'customId', header: t('item:listFields.customId') },
        ],
        [t]
    )
}
