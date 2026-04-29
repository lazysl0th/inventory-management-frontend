import type { ReactNode } from 'react'
import type { FormSelectProps } from 'react-bootstrap'

export interface ISelectProps extends FormSelectProps {
    label?: string
    inputPrefix?: string
    helpText?: string
    name: string
    children: ReactNode
}
