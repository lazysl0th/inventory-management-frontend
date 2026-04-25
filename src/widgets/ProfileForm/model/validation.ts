import * as Yup from 'yup'

export const profileSchema = Yup.object({
    name: Yup.string().required('name.required'),
    email: Yup.string().email('email.email').required('email.required'),
})
