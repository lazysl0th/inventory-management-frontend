import { object, string } from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js'

export const AdditionalInfoSchema = object({
    Phone: string()
        .required('Phone.required')
        .test('is-valid-phone', 'Phone.test', (value) =>
            isValidPhoneNumber(value || '')
        ),
    ShippingCity: string()
        .required('ShippingCity.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingCity.matches'
        ),
    ShippingStreet: string()
        .required('ShippingStreet.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingStreet.matches'
        ),
    ShippingCountryCode: string()
        .required('ShippingCountry.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingCountry.matches'
        ),
    ShippingPostalCode: string()
        .required('ShippingPostalCode.required')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'ShippingPostalCode.matches'
        ),
})
