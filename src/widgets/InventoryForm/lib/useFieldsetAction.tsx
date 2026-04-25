import { IAction } from '@/shared/ui/ActionButtons'
import { IUseFieldsetActionsProps } from '../model/types'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Tooltip } from '@/shared/ui/Tooltip'
import { BsFillTrashFill } from 'react-icons/bs'

export const useFieldsetActions = ({
    onMoveUp,
    onMoveDown,
    onDelete,
}: IUseFieldsetActionsProps): IAction[] => [
    {
        name: 'partIdMoveUp',
        placement: 'top',
        overlay: <Tooltip tooltip='Up' />,
        variant: 'outline-dark',
        icon: FaChevronUp,
        onClickHandler: onMoveUp,
    },
    {
        name: 'partIdMoveDown',
        placement: 'top',
        overlay: <Tooltip tooltip='Down' />,
        variant: 'outline-dark',
        icon: FaChevronDown,
        onClickHandler: onMoveDown,
    },
    {
        name: 'partIdDelete',
        placement: 'top',
        overlay: <Tooltip tooltip='Delete' />,
        variant: 'outline-danger',
        icon: BsFillTrashFill,
        onClickHandler: onDelete,
    },
]
