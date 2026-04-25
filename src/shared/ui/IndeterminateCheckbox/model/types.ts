import { InputHTMLAttributes } from 'react'

export interface IIndeterminateCheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
> {
    indeterminate?: boolean
}
