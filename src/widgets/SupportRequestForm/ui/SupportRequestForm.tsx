import { useDispatch } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { showToast } from '@/shared/model/ui'
import { useSendSupportRequestMutation } from '@/features/integration'
import type { ISupportRequestForm } from '../model/types'
import { supportRequestShema } from '../model/validation'
import { useGetInventoryQuery } from '@/entities/inventory'
import { useTranslation } from 'react-i18next'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { FloatingSelect } from '@/shared/ui/Form/ui/FloatingSelect'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const SupportRequestForm = () => {
    const match = useMatch('/inventories/:inventoryId')
    const inventoryId = match?.params.inventoryId
    const dispatch = useDispatch()
    const { t } = useTranslation(['support', 'validation', 'common'])
    const { currentUser } = useCurrentUser()

    const [sendSupportRequest] = useSendSupportRequestMutation()

    const submitHandler = async (values: ISupportRequestForm) => {
        try {
            await sendSupportRequest(values).unwrap()
            dispatch(showToast({ message: t('support:notifications.success') }))
        } catch (e) {
            dispatch(showToast({ message: t('support:notifications.error') }))
            console.log(e)
        }
    }

    const { data: inventory } = useGetInventoryQuery(
        inventoryId && inventoryId !== 'new' ? { inventoryId } : skipToken
    )

    const initialValues = {
        userName: currentUser?.name || '',
        userEmail: currentUser?.email || '',
        inventory: inventory?.title || '',
        link: window.location.href,
        priority: '',
        request: '',
    }

    const formikConfig = {
        initialValues,
        validationSchema: supportRequestShema,
        onSubmit: submitHandler,
    }

    return (
        <FormProvider
            config={formikConfig}
            className='d-flex flex-column gap-2'
            id='supportRequest'
        >
            <FloatingInput
                name='userName'
                label={t('common:labels.name')}
                type='text'
                placeholder={t('common:placeholders.name')}
            />
            <FloatingInput
                name='userEmail'
                label={t('common:labels.email')}
                type='email'
                placeholder='name@example.com'
            />
            <FloatingInput
                name='inventory'
                label={t('support:labels.inventory')}
                type='text'
                placeholder={t('support:placeholders.inventory')}
            />
            <FloatingInput
                name='link'
                label={t('support:labels.link')}
                type='text'
                placeholder={t('support:placeholders.link')}
            />

            <FloatingSelect
                name='priority'
                label={t('support:labels.priority')}
            >
                <option value='' disabled>
                    {t('support:options.priority')}
                </option>
                <option value='high'>{t('support:options.high')}</option>
                <option value='average'>{t('support:options.average')}</option>
                <option value='low'>{t('support:options.low')}</option>
            </FloatingSelect>

            <FloatingInput
                name='request'
                label={t('support:labels.request')}
                as='textarea'
                placeholder={t('support:placeholders.request')}
            />
            <SubmitButton
                form='supportRequest'
                containerId='infoTooltip--footer'
                label={t('common:actions.send')}
            />
        </FormProvider>
    )
}

export default SupportRequestForm
