import { IFieldApi } from '@/shared/lib/hooks/useFormikApi'
import { FormControlProps } from 'react-bootstrap'

export type InputElement = HTMLInputElement | HTMLTextAreaElement

export interface IInputProps extends FormControlProps {
    label?: string
    inputPrefix?: React.ReactNode
    helpText?: string
    imageUrl?: string
    name: string
    rows?: number
    api?: {
        field: IFieldApi<string>
    }
}
