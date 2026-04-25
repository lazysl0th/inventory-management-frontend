import * as Yup from 'yup'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const AdditionalInfoSchema = Yup.object({
    Phone: Yup.string()
        .required('Phone.required')
        .test('is-valid-phone', 'Phone.test', (value) =>
            isValidPhoneNumber(value || '')
        ),
    ShippingCity: Yup.string()
        .required('ShippingCity.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingCity.matches'
        ),
    ShippingStreet: Yup.string()
        .required('ShippingStreet.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingStreet.matches'
        ),
    ShippingCountryCode: Yup.string()
        .required('ShippingCountry.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingCountry.matches'
        ),
    ShippingPostalCode: Yup.string()
        .required('ShippingPostalCode.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingPostalCode.matches'
        ),
})
