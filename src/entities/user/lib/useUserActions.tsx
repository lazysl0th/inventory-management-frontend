import { Tooltip } from '@/shared/ui/Tooltip'
import { BsFillTrashFill } from 'react-icons/bs'
import { UseUserActionsProps } from '../model/types'
import type { IAction } from '@/shared/ui/ActionButtons'
import { CiLock, CiUnlock } from 'react-icons/ci'
import {
    MdAdminPanelSettings,
    MdOutlineAdminPanelSettings,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

export const useUserActions = ({
    onBlock,
    onUnblock,
    onGrant,
    onRevoke,
    onDelete,
    selectedCount,
}: UseUserActionsProps): IAction[] => {
    const { t } = useTranslation('commons')

    return [
        {
            name: 'blockUsers',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.blockRecords', {
                        count: selectedCount,
                        recordType: 'user',
                    })}
                />
            ),
            variant: 'outline-dark',
            icon: CiLock,
            onClickHandler: onBlock,
            disabled: !selectedCount,
        },
        {
            name: 'unblockUsers',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.unblockRecords', {
                        count: selectedCount,
                        recordType: 'user',
                    })}
                />
            ),
            variant: 'outline-dark',
            icon: CiUnlock,
            onClickHandler: onUnblock,
            disabled: !selectedCount,
        },
        {
            name: 'grantAdminAccessUsers',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.grantPermission', {
                        count: selectedCount,
                        recordType: 'user',
                    })}
                />
            ),
            variant: 'outline-success',
            icon: MdOutlineAdminPanelSettings,
            onClickHandler: onGrant,
            disabled: !selectedCount,
        },
        {
            name: 'revokeAdminAccessUsers',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.revokePermission', {
                        count: selectedCount,
                        recordType: 'user',
                    })}
                />
            ),
            variant: 'outline-danger',
            icon: MdAdminPanelSettings,
            onClickHandler: onRevoke,
            disabled: !selectedCount,
        },
        {
            name: 'deleteUsers',
            placement: 'top',
            overlay: (
                <Tooltip
                    tooltip={t('common:actions.deleteRecords', {
                        count: selectedCount,
                        recordType: 'user',
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
