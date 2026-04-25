import * as Yup from 'yup'

export const changePasswordSchema = Yup.object({
    password: Yup.string().min(1, 'password.min').required('password.required'),
})

export const resetPasswordSchema = Yup.object({
    email: Yup.string().email('email.email').required('email.required'),
})

export const signupSchema = Yup.object({
    name: Yup.string().required('name.required'),
    email: Yup.string().email('email.email').required('email.required'),
    password: Yup.string().min(1, 'password.min').required('password.required'),
})

export const signinSchema = Yup.object({
    email: Yup.string().email('email.email').required('email.required'),
    password: Yup.string().min(1, 'password.min').required('password.required'),
})
