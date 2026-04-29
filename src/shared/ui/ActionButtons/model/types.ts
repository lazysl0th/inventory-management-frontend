import type { ButtonGroupProps } from 'react-bootstrap'
import type { ButtonVariant, Placement } from 'react-bootstrap/esm/types'
import type { OverlayChildren } from 'react-bootstrap/esm/Overlay'
import type { IconType } from 'react-icons'
import type { MouseEventHandler } from 'react'

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
