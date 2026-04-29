import { object, string } from 'yup'

export const searchSchema = object({
    searchQuery: string()
        .trim()
        .required('searchQuery.required')
        .max(100, 'searchQuery.max')
        .matches(
            /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u,
            'searchQuery.matches'
        ),
})
