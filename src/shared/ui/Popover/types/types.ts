import type { JSX } from 'react'
import type { PopoverProps } from 'react-bootstrap'

export interface IPopoverProps extends PopoverProps {
    children: JSX.Element
}
