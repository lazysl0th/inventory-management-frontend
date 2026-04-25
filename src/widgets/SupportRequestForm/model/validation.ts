import * as Yup from 'yup'

export const supportRequestShema = Yup.object({
    userName: Yup.string().required('name.required'),
    userEmail: Yup.string().email('email.email').required('email.required'),
    priority: Yup.string()
        .required('Select priority')
        .oneOf(['high', 'average', 'low'], 'Invalid priority'),
    request: Yup.string().required('Enter request'),
})
