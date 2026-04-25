import { OverlayTrigger, OverlayTriggerProps } from 'react-bootstrap'

const OverlayTooltip = ({
    placement,
    overlay,
    children,
    ...rest
}: OverlayTriggerProps) => {
    return (
        <OverlayTrigger
            {...rest}
            placement={placement ?? undefined}
            trigger={placement ? ['hover', 'focus'] : []}
            overlay={overlay}
        >
            {children}
        </OverlayTrigger>
    )
}

export default OverlayTooltip
