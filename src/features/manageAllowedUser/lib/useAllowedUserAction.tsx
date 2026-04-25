import { Tooltip } from '@/shared/ui/Tooltip'
import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import { IAction } from '@/shared/ui/ActionButtons'
import { UseAllowedUserActionsProps } from '../model/types'

export const useAllowedUserActions = ({
    onAdd,
    onDelete,
    onAddState,
    onDeleteState,
}: UseAllowedUserActionsProps): IAction[] => [
    {
        name: 'addUser',
        placement: 'top',
        overlay: <Tooltip tooltip='Add user' />,
        variant: 'outline-success',
        icon: VscAdd,
        onClickHandler: onAdd,
        disabled: onAddState,
    },
    {
        name: 'deleteUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Delete users' />,
        variant: 'outline-danger',
        icon: BsFillTrashFill,
        onClickHandler: onDelete,
        disabled: onDeleteState,
    },
]
