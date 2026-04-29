import type { ButtonProps, OverlayTriggerProps } from 'react-bootstrap'
import type { Placement } from 'react-bootstrap/esm/types'
import type { OverlayChildren } from 'react-bootstrap/esm/Overlay'
import type { ReactNode } from 'react'

export type TOverlayTooltipProps = Omit<OverlayTriggerProps, 'children'>

export interface IButtonProps extends ButtonProps {
    showOverlay?: boolean
    placement?: Placement
    overlay?: OverlayChildren
    children?: ReactNode
}
