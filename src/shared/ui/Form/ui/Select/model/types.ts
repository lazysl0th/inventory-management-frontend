import { ReactNode } from 'react'
import { FormSelectProps } from 'react-bootstrap'

export interface ISelectProps extends FormSelectProps {
    label?: string
    inputPrefix?: string
    helpText?: string
    name: string
    children: ReactNode
}
