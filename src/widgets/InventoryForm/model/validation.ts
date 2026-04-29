import { object, string } from 'yup'

export const inventorySchema = object({
    title: string().required('title.required'),
    category: string().required('category.required'),
})
