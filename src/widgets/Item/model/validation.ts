import { object, string } from 'yup';

export const itemSchema = (regex: RegExp, isNew: boolean) =>
    object({
        customId: isNew 
            ? string().notRequired()
            : string()
                .required('Custom ID is required')
                .matches(regex, 'Invalid custom ID format')
    })
