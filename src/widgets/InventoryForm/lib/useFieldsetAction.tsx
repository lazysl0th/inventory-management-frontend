import type { IAction } from '@/shared/ui/ActionButtons'
import type { IUseFieldsetActionsProps } from '../model/types'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Tooltip } from '@/shared/ui/Tooltip'
import { BsFillTrashFill } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'

export const useFieldsetActions = ({
    onMoveUp,
    onMoveDown,
    onDelete,
}: IUseFieldsetActionsProps): IAction[] => {
    const { t } = useTranslation('common')
    return [
        {
            name: 'partIdMoveUp',
            placement: 'top',
            overlay: <Tooltip tooltip={t('common:actions.up')} />,
            variant: 'outline-dark',
            icon: FaChevronUp,
            onClickHandler: onMoveUp,
        },
        {
            name: 'partIdMoveDown',
            placement: 'top',
            overlay: <Tooltip tooltip={t('common:actions.down')} />,
            variant: 'outline-dark',
            icon: FaChevronDown,
            onClickHandler: onMoveDown,
        },
        {
            name: 'partIdDelete',
            placement: 'top',
            overlay: <Tooltip tooltip={t('common:actions.delete')} />,
            variant: 'outline-danger',
            icon: BsFillTrashFill,
            onClickHandler: onDelete,
        },
    ]
}
