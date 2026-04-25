import { FormCheckProps } from 'react-bootstrap'

export interface ICheckProps extends Omit<FormCheckProps, 'as'> {
    inputPrefix?: string
    helpText?: string
    name: string
}
