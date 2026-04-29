import type { FormikConfig } from 'formik'
import type { FormProps } from 'react-router-dom'

export interface IFormProps<T extends object> extends FormProps {
    config: FormikConfig<T>
    children: React.ReactNode
}
