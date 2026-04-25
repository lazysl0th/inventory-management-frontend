import { ButtonProps, OverlayTriggerProps } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/esm/types'
import { OverlayChildren } from 'react-bootstrap/esm/Overlay'
import { ReactNode } from 'react'

export type TOverlayTooltipProps = Omit<OverlayTriggerProps, 'children'>

export interface IButtonProps extends ButtonProps {
    showOverlay?: boolean
    placement?: Placement
    overlay?: OverlayChildren
    children?: ReactNode
}
