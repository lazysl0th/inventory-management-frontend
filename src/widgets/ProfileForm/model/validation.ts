import { object, string } from 'yup'

export const profileSchema = object({
    name: string().required('name.required'),
    email: string().email('email.email').required('email.required'),
})
