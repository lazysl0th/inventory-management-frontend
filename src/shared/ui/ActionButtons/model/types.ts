import { ButtonGroupProps } from 'react-bootstrap'
import { ButtonVariant, Placement } from 'react-bootstrap/esm/types'
import { OverlayChildren } from 'react-bootstrap/esm/Overlay'
import { IconType } from 'react-icons'
import { MouseEventHandler } from 'react'

export interface IAction {
    name: string
    placement?: Placement
    overlay?: OverlayChildren
    variant?: ButtonVariant
    icon?: IconType
    onClickHandler: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
}

export interface IActionButtonsProps extends ButtonGroupProps {
    actions: IAction[]
}
