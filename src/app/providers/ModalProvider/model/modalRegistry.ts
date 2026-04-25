import { AppModals } from '@/shared/model/ui'
import { IConfig } from './types'
import { SupportRequestForm } from '@/widgets/SupportRequestForm'
import { AdditionalInfoForm } from '@/widgets/AdditionalInfo'
import { VersionConflictDialog } from '@/widgets/VersionConflictDialog'

export const modalRegistry: Partial<Record<AppModals, IConfig>> = {
    [AppModals.Help]: {
        infoTooltipContent: {
            title: 'Support Request',
            Body: SupportRequestForm,
        },
    },
    [AppModals.AdditionalInfo]: {
        infoTooltipContent: {
            title: 'Additional info',
            Body: AdditionalInfoForm,
        },
    },
    [AppModals.VersionConflict]: {
        infoTooltipContent: {
            title: 'Version conflict',
            Body: VersionConflictDialog,
        },
    },
}
