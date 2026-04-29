import { object, string } from 'yup'

export const changePasswordSchema = object({
    password: string().min(1, 'password.min').required('password.required'),
})

export const resetPasswordSchema = object({
    email: string().email('email.email').required('email.required'),
})

export const signupSchema = object({
    name: string().required('name.required'),
    email: string().email('email.email').required('email.required'),
    password: string().min(1, 'password.min').required('password.required'),
})

export const signinSchema = object({
    email: string().email('email.email').required('email.required'),
    password: string().min(1, 'password.min').required('password.required'),
})
