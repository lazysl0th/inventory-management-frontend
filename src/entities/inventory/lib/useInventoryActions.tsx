import { Tooltip } from '@/shared/ui/Tooltip'
import { VscAdd } from 'react-icons/vsc'
import { BsFillTrashFill } from 'react-icons/bs'
import { IUseInventoryActionsProps } from '../model/types'
import { IAction } from '@/shared/ui/ActionButtons'

export const useInventoryActions = ({
    onAdd,
    onDelete,
    selectedCount,
}: IUseInventoryActionsProps): IAction[] => [
    {
        name: 'addInventory',
        placement: 'top',
        overlay: <Tooltip tooltip='Add inventory' />,
        variant: 'outline-success',
        icon: VscAdd,
        onClickHandler: onAdd,
    },
    {
        name: 'deleteInventories',
        placement: 'top',
        overlay: <Tooltip tooltip='Delete inventories' />,
        variant: 'outline-danger',
        icon: BsFillTrashFill,
        onClickHandler: onDelete,
        disabled: !selectedCount,
    },
]
