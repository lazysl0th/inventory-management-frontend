import { useTranslation } from 'react-i18next'
import { useFormikApi } from '../../../shared/lib/hooks/useFormikApi'
import { useEffect } from 'react'
import FloatingSelect from '@/shared/ui/Form/ui/FloatingSelect/ui/FloatingSelect'
import { useGetAddressQuery } from '@/features/integration'
import { isBitSet } from '../lib/addressHelpers'

const StateField = () => {
    const { t } = useTranslation('profile')
    const { t: tc } = useTranslation('common')

    const { field: ShippingCountryCode } =
        useFormikApi<string>(`ShippingCountryCode`)

    const { field: ShippingStateCode } =
        useFormikApi<string>(`ShippingStateCode`)

    useEffect(() => {
        ShippingStateCode.setValue('')
    }, [ShippingCountryCode.value])

    const {
        data: address,
        isLoading: addressIsLoading,
        error: addressError,
        isSuccess: addressIsSuccess,
    } = useGetAddressQuery()

    const getStatesForCountry = (countryCode: string) => {
        const index = address?.countries.findIndex(
            (country) => country.value === countryCode
        )
        if (index === undefined || index === -1) return []
        return address?.states.filter(
            (state) => state.validFor && isBitSet(state.validFor, index)
        )
    }

    const filteredStates = getStatesForCountry(ShippingCountryCode.value) || []

    return (
        <FloatingSelect
            name='ShippingStateCode'
            label={t('labels.shippingAddress.state')}
        >
            <option value='' disabled>
                {addressIsLoading ? t('options.loading') : t('options.state')}
            </option>
            {filteredStates.map((state) => (
                <option key={state.label} value={state.value}>
                    {tc(`states.${state.label}`)}
                </option>
            ))}
        </FloatingSelect>
    )
}

export default StateField
