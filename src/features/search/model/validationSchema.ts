import * as Yup from 'yup'

export const searchSchema = Yup.object({
    searchQuery: Yup.string()
        .trim()
        .required('searchQuery.required')
        .max(100, 'searchQuery.max')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'searchQuery.matches'
        ),
})
