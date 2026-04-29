import { object, string } from 'yup';

export const supportRequestShema = object({
    userName: string().required('name.required'),
    userEmail: string().email('email.email').required('email.required'),
    priority: string()
        .required('Select priority')
        .oneOf(['high', 'average', 'low'], 'Invalid priority'),
    request: string().required('Enter request'),
})
