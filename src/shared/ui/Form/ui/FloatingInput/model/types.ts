import type{ ForwardRefExoticComponent, RefAttributes } from 'react'
import type { FloatingLabelProps } from 'react-bootstrap'

export interface IFloatingInputProps extends FloatingLabelProps {
    helpText?: string
    name: string
    type?: string
    placeholder?: string
    button?: ForwardRefExoticComponent<RefAttributes<HTMLInputElement>>
}
