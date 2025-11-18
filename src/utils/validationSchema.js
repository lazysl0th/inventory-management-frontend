import * as Yup from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";

export const searchSchema = Yup.object({
    searchQuery: Yup.string()
        .trim()
        .required('searchQuery.required')
        .max(100, 'searchQuery.max')
        .matches( /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u, 'searchQuery.matches')
    })

export const SignupSchema = Yup.object({
    name: Yup.string().required("name.required"),
    email: Yup.string().email("email.email").required("email.required"),
    password: Yup.string().min(1, "password.min").required("password.required"),
});

export const SigninSchema = Yup.object({
    email: Yup.string().email("email.email").required("email.required"),
    password: Yup.string().min(1, "password.min").required("password.required"),
});

export const InventorySchema = Yup.object({
    title: Yup.string().required("title.required"),
    category: Yup.string().required('category.required'),
})

export const ResetPasswordSchema = Yup.object({
    email: Yup.string().email("email.email").required("email.required"),
});

export const ChangePasswordSchema = Yup.object({
    password: Yup.string().min(1, "password.min").required("password.required"),
});

export const ProfileSchema = Yup.object({
    name: Yup.string().required("name.required"),
    email: Yup.string().email("email.email").required("email.required"),
});

export const AdditionalInfoSchema = Yup.object({
    Phone: Yup.string().required("Phone.required").test("is-valid-phone", "Phone.test", value => isValidPhoneNumber(value || "")),
    ShippingCity: Yup.string().required("ShippingCity.required").matches(/^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u, "ShippingCity.matches"),
    ShippingStreet: Yup.string().required("ShippingStreet.required").matches(/^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u, "ShippingStreet.matches"),
    ShippingCountryCode: Yup.string().required("ShippingCountry.required").matches(/^[\p{Alpha}\p{M}\p{Pc}\p{Join_C}\s-]+$/u, "ShippingCountry.matches"),
    ShippingPostalCode: Yup.string().required("ShippingPostalCode.required").matches(/^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u, "ShippingPostalCode.matches"),
});

export const SupportRequesShema = Yup.object({
    userName: Yup.string().required("name.required"),
    userEmail: Yup.string().email("email.email").required("email.required"),
    priority: Yup.string().required('Select priority').oneOf(['high', 'average', 'low'], 'Invalid priority'),
    request: Yup.string().required("Enter request"),
})