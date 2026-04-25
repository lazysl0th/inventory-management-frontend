import { FormikConfig } from 'formik'
import { FormProps } from 'react-router-dom'

export interface IFormProps<T extends object> extends FormProps {
    config: FormikConfig<T>
    children: React.ReactNode
}
