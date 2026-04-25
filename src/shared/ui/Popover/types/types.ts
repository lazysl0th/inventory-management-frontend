import { JSX } from 'react'
import { PopoverProps } from 'react-bootstrap'

export interface IPopoverProps extends PopoverProps {
    children: JSX.Element
}
