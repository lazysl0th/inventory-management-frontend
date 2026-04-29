import { Tooltip } from '@/shared/ui/Tooltip'
import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import type { IAction } from '@/shared/ui/ActionButtons'
import { UseAllowedUserActionsProps } from '../model/types'
import { useTranslation } from 'react-i18next'

export const useAllowedUserActions = ({
    onAdd,
    onDelete,
    onAddState,
    onDeleteState,
    selectedCount
}: UseAllowedUserActionsProps): IAction[] => {
    const {t} = useTranslation('common')
    return ([
        {
            name: 'addUser',
            placement: 'top',
            overlay: <Tooltip tooltip={t('common:actions.addRecord', { recordType: 'user' })} />,
            variant: 'outline-success',
            icon: VscAdd,
            onClickHandler: onAdd,
            disabled: onAddState,
        },
        {
            name: 'deleteUsers',
            placement: 'top',
            overlay: <Tooltip tooltip={t('common:actions.deleteRecords', { count: selectedCount, recordType: 'user' })} />,
            variant: 'outline-danger',
            icon: BsFillTrashFill,
            onClickHandler: onDelete,
            disabled: onDeleteState || !selectedCount,
        },
    ])
}