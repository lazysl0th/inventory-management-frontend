import { Button as RBButton } from 'react-bootstrap'
import { IButtonProps } from '../model/types'
import { OverlayTooltip } from '../../OverlayTooltip'

const Button = ({
    showOverlay,
    placement,
    overlay = <></>,
    variant,
    children,
    ...rest
}: IButtonProps) => {
    return (
        <OverlayTooltip
            placement={placement}
            overlay={overlay}
            show={showOverlay}
        >
            <RBButton variant={variant} {...rest}>
                {children}
            </RBButton>
        </OverlayTooltip>
    )
}

export default Button
