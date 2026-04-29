import { Tooltip as RBTooltip } from 'react-bootstrap'
import type { ITooltipProps } from '../model/types'

const Tooltip = ({ tooltip, ...rest }: ITooltipProps) => {
    return (
        <RBTooltip
            {...rest}
            id={tooltip.toLocaleLowerCase().replaceAll(' ', '_')}
        >
            {tooltip}
        </RBTooltip>
    )
}

export default Tooltip
