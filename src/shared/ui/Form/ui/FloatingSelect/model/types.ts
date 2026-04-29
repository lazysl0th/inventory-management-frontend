import type { FloatingLabelProps } from 'react-bootstrap'

export interface IFloatingSelectProps extends FloatingLabelProps {
    helpText?: string
    name: string
    type?: string
}
