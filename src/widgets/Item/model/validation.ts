import * as Yup from 'yup'

export const itemSchema = (regex: RegExp) =>
    Yup.object({
        customId: Yup.string()
            .required('Custom ID is required')
            .matches(regex, 'Invalid custom ID format'),
    })
