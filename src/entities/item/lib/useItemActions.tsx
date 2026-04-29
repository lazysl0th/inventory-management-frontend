import { Tooltip } from '@/shared/ui/Tooltip'
import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import type { IAction } from '@/shared/ui/ActionButtons'
import { UseItemActionsProps } from '../model/types'
import { useTranslation } from 'react-i18next'

export const useItemActions = ({
    onAdd,
    onDelete,
    onAddState,
    onDeleteState,
    selectedCount,
}: UseItemActionsProps): IAction[] => {
    const { t } = useTranslation('common')
    return [
        {
            name: 'addItem',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.addRecord', {
                        recordType: 'item',
                    })}
                />
            ),
            variant: 'outline-success',
            icon: VscAdd,
            onClickHandler: onAdd,
            disabled: onAddState,
        },
        {
            name: 'deleteItems',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.deleteRecords', {
                        count: selectedCount,
                        recordType: 'item',
                    })}
                />
            ),
            variant: 'outline-danger',
            icon: BsFillTrashFill,
            onClickHandler: onDelete,
            disabled: onDeleteState || !selectedCount,
        },
    ]
}
