import { useTranslation } from 'react-i18next'
import { FormikConfig } from 'formik'
import StateField from './StateField'
import { useMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/query'
import { AdditionalInfoSchema } from '../model/validation'
import { showToast } from '@/shared/model/ui'
import {
    useAddAdditionInfoMutation,
    useGetAdditionInfoQuery,
    useGetAddressQuery,
} from '@/features/integration'
import type { IAdditionalInfoForm } from '../model/types'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { FloatingSelect } from '@/shared/ui/Form/ui/FloatingSelect'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const AdditionalInfoForm = () => {
    const { currentUser } = useCurrentUser()
    const match = useMatch('/users/:userId')
    const userId = match?.params.userId || currentUser?.id
    const { t } = useTranslation(['common', 'user'])
    const dispatch = useDispatch()

    const {
        data: address,
        isLoading: addressIsLoading,
    } = useGetAddressQuery()

    const {
        data: additionalInfo,
    } = useGetAdditionInfoQuery(userId ? { userId } : skipToken)

    const [addAditionalInfo] = useAddAdditionInfoMutation()

    const submitHandler = async (values: IAdditionalInfoForm) => {
        if (!userId) return
        try {
            await addAditionalInfo({ userId, ...values }).unwrap()
            dispatch(showToast({message: t('user:toasts.updateUserSuccess')}))
        } catch (e) {
            dispatch(showToast({message: t('user:toasts.updateUserFailed')}))
            console.log(e)
        }
    }

    const initialValues = {
        Phone: additionalInfo?.records[0]?.Phone || '',
        ShippingCountryCode:
            additionalInfo?.records[0]?.ShippingCountryCode || '',
        ShippingCity: additionalInfo?.records[0]?.ShippingCity || '',
        ShippingStateCode: additionalInfo?.records[0]?.ShippingStateCode || '',
        ShippingStreet: additionalInfo?.records[0]?.ShippingStreet || '',
        ShippingPostalCode:
            additionalInfo?.records[0]?.ShippingPostalCode || '',
    }

    const formikConfig: FormikConfig<IAdditionalInfoForm> = {
        initialValues,
        validationSchema: AdditionalInfoSchema,
        onSubmit: submitHandler,
        enableReinitialize: true,
    }

    return (
        <FormProvider<IAdditionalInfoForm>
            config={formikConfig}
            className='d-flex flex-column gap-2'
            id='additionalInfo'
        >
            <FloatingInput
                name='Phone'
                label={t('user:labels.phone')}
                type='tel'
                placeholder={t('user:placeholders.phone')}
            />

            <legend>{t('user:legends.shippingAddress')}</legend>

            <FloatingSelect
                name='ShippingCountryCode'
                label={t('user:labels.country')}
            >
                <option value='' disabled>
                    {addressIsLoading
                        ? t('common:options.loading')
                        : t('geo:options.country')}
                </option>
                {address?.countries.map((country) => (
                    <option key={country.value} value={country.value}>
                        {t(`geo:countries.${country.label}`)}
                    </option>
                ))}
            </FloatingSelect>

            <StateField />

            <FloatingInput
                name='ShippingCity'
                label={t('geo:labels.city')}
                placeholder={t('geo:placeholders.city')}
            />

            <FloatingInput
                name='ShippingStreet'
                label={t('geo:labels.street')}
                placeholder={t('geo:placeholders.street')}
            />

            <FloatingInput
                name='ShippingPostalCode'
                label={t('geo:labels.postalCode')}
                placeholder={t('geo:placeholders.postalCode')}
            />
            <SubmitButton<IAdditionalInfoForm>
                form='additionalInfo'
                containerId='infoTooltip--footer'
                label={t('user:actions.addAdditionalInfo')}
            />
        </FormProvider>
    )
}

export default AdditionalInfoForm
