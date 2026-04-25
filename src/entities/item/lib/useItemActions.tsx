import { Tooltip } from '@/shared/ui/Tooltip'
import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import { IAction } from '@/shared/ui/ActionButtons'
import { UseItemActionsProps } from '../model/types'

export const useItemActions = ({
    onAdd,
    onDelete,
    onAddState,
    onDeleteState,
}: UseItemActionsProps): IAction[] => [
    {
        name: 'addItem',
        placement: 'top',
        overlay: <Tooltip tooltip='Add item' />,
        variant: 'outline-success',
        icon: VscAdd,
        onClickHandler: onAdd,
        disabled: onAddState,
    },
    {
        name: 'deleteItems',
        placement: 'top',
        overlay: <Tooltip tooltip='Delete items' />,
        variant: 'outline-danger',
        icon: BsFillTrashFill,
        onClickHandler: onDelete,
        disabled: onDeleteState,
    },
]
