import { Tooltip } from '@/shared/ui/Tooltip'
import { BsFillTrashFill } from 'react-icons/bs'
import { UseUserActionsProps } from '../model/types'
import { IAction } from '@/shared/ui/ActionButtons'
import { CiLock, CiUnlock } from 'react-icons/ci'
import {
    MdAdminPanelSettings,
    MdOutlineAdminPanelSettings,
} from 'react-icons/md'

export const useUserActions = ({
    onBlock,
    onUnblock,
    onGrant,
    onRevoke,
    onDelete,
    selectedCount,
}: UseUserActionsProps): IAction[] => [
    {
        name: 'blockUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Block users' />,
        variant: 'outline-dark',
        icon: CiLock,
        onClickHandler: onBlock,
        disabled: !selectedCount,
    },
    {
        name: 'unblockUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Unblock users' />,
        variant: 'outline-dark',
        icon: CiUnlock,
        onClickHandler: onUnblock,
        disabled: !selectedCount,
    },
    {
        name: 'grantAdminAccessUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Grant admin access' />,
        variant: 'outline-success',
        icon: MdOutlineAdminPanelSettings,
        onClickHandler: onGrant,
        disabled: !selectedCount,
    },
    {
        name: 'revokeAdminAccessUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Revoke admin access' />,
        variant: 'outline-danger',
        icon: MdAdminPanelSettings,
        onClickHandler: onRevoke,
        disabled: !selectedCount,
    },
    {
        name: 'deleteUsers',
        placement: 'top',
        overlay: <Tooltip tooltip='Delete users' />,
        variant: 'outline-danger',
        icon: BsFillTrashFill,
        onClickHandler: onDelete,
        disabled: !selectedCount,
    },
]
