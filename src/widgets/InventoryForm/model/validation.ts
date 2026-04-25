import * as Yup from 'yup'

export const inventorySchema = Yup.object({
    title: Yup.string().required('title.required'),
    category: Yup.string().required('category.required'),
})
