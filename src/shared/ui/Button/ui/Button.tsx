import { Button as RBButton } from 'react-bootstrap'
import type { IButtonProps } from '../model/types'
import { lazy } from 'react'

const OverlayTooltip = lazy(() => import('../../OverlayTooltip').then(module => ({ default: module.OverlayTooltip })))

const Button = ({
    showOverlay,
    placement,
    overlay = <></>,
    variant,
    children,
    ...rest
}: IButtonProps) => {

    return (
        overlay ? 
        <OverlayTooltip
            placement={placement}
            overlay={overlay}
            show={showOverlay}
        >
            <RBButton variant={variant} {...rest}>
                {children}
            </RBButton>
        </OverlayTooltip>
        : <RBButton variant={variant} {...rest}>
                {children}
            </RBButton>
    )
}

export default Button
