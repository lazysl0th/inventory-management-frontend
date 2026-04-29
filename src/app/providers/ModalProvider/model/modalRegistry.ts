import { AppModals } from '@/shared/model/ui'
import { IConfig } from './types'
import { lazy } from 'react';

const SupportRequestForm = lazy(() => import('@/widgets/SupportRequestForm').then(module => ({ default: module.SupportRequestForm })));
const AdditionalInfoForm = lazy(() => import('@/widgets/AdditionalInfoForm').then(module => ({ default: module.AdditionalInfoForm })));
const VersionConflictDialog = lazy(() => import('@/widgets/VersionConflictDialog').then(module => ({ default: module.VersionConflictDialog })));


export const modalRegistry: Partial<Record<AppModals, IConfig>> = {
    [AppModals.Help]: {
        infoTooltipContent: {
            titleKey: 'supportRequest',
            Body: SupportRequestForm,
        },
    },
    [AppModals.AdditionalInfo]: {
        infoTooltipContent: {
            titleKey: 'additionalInfo',
            Body: AdditionalInfoForm,
        },
    },
    [AppModals.VersionConflict]: {
        infoTooltipContent: {
            titleKey: 'versionConflict',
            Body: VersionConflictDialog,
        },
    },
}
