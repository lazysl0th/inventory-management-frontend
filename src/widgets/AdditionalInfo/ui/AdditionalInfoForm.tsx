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
import { IAdditionalInfoForm } from '../model/types'
import {
    FloatingInput,
    FloatingSelect,
    FormProvider,
    SubmitButton,
} from '@/shared/ui/Form'
import { useCurrentUser } from '@/entities/user'

const AdditionalInfoForm = () => {
    const { currentUser } = useCurrentUser()
    const match = useMatch('/users/:userId')
    const userId = match?.params.userId || currentUser?.id
    const { t } = useTranslation('profile')
    const { t: tc } = useTranslation('common')
    const dispatch = useDispatch()

    const {
        data: address,
        isLoading: addressIsLoading,
        error: addressError,
        isSuccess: addressIsSuccess,
    } = useGetAddressQuery()

    const {
        data: additionalInfo,
        isLoading: additionalInfoIsLoading,
        error: additionalInfoError,
        isSuccess: additionalInfoIsSuccess,
    } = useGetAdditionInfoQuery(userId ? { userId } : skipToken)

    const [addAditionalInfo] = useAddAdditionInfoMutation()

    const submitHandler = async (values: IAdditionalInfoForm) => {
        if (!userId) return
        try {
            await addAditionalInfo({ userId, ...values }).unwrap()
            dispatch(showToast({message: t('toasts.updateUserSucces')}))
        } catch (e) {
            dispatch(showToast({message: t('toasts.updateUserFailed')}))
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
                label={t('labels.phone')}
                type='tel'
                placeholder={t('placeholders.phone')}
            />

            <legend>{t('labels.shippingAddress.shippingAddress')}</legend>

            <FloatingSelect
                name='ShippingCountryCode'
                label={t('labels.shippingAddress.country')}
            >
                <option value='' disabled>
                    {addressIsLoading
                        ? t('options.loading')
                        : t('options.country')}
                </option>
                {address?.countries.map((country) => (
                    <option key={country.value} value={country.value}>
                        {tc(`countries.${country.label}`)}
                    </option>
                ))}
            </FloatingSelect>

            <StateField />

            <FloatingInput
                name='ShippingCity'
                label={t('labels.shippingAddress.city')}
                placeholder={t('placeholders.city')}
            />

            <FloatingInput
                name='ShippingStreet'
                label={t('labels.shippingAddress.street')}
                placeholder={t('placeholders.street')}
            />

            <FloatingInput
                name='ShippingPostalCode'
                label={t('labels.shippingAddress.postalCode')}
                placeholder={t('placeholders.postalCode')}
            />
            <SubmitButton<IAdditionalInfoForm>
                form='additionalInfo'
                containerId='infoTooltip--footer'
                label={t('buttons.addAditionalInfo')}
            />
        </FormProvider>
    )
}

export default AdditionalInfoForm
