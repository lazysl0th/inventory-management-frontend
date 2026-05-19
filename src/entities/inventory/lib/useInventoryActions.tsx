import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import type { IUseInventoryActionsProps } from '../model/types'
import { useTranslation } from 'react-i18next'
import type { IAction } from '@/shared/ui/ActionButtons'
import { lazy } from 'react'

const Tooltip = lazy(() =>
    import('@/shared/ui/Tooltip').then((module) => ({
        default: module.Tooltip,
    }))
)

export const useInventoryActions = ({
    onAdd,
    onDelete,
    selectedCount,
}: IUseInventoryActionsProps): IAction[] => {
    const { t } = useTranslation('common')
    return [
        {
            name: 'addInventory',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.addRecord', {
                        recordType: 'inventory',
                    })}
                />
            ),
            variant: 'outline-success',
            icon: VscAdd,
            onClickHandler: onAdd,
        },
        {
            name: 'deleteInventories',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.deleteRecords', {
                        count: selectedCount,
                        recordType: 'inventory',
                    })}
                />
            ),
            variant: 'outline-danger',
            icon: BsFillTrashFill,
            onClickHandler: onDelete,
            disabled: !selectedCount,
        },
    ]
}
