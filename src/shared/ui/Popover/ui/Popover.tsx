import { Popover as RBPopover } from 'react-bootstrap'
import { IPopoverProps } from '../types/types'

const Popover = ({ children, ...rest }: IPopoverProps) => {
    return (
        <RBPopover {...rest}>
            <RBPopover.Body className='p-0'>{children}</RBPopover.Body>
        </RBPopover>
    )
}

export default Popover
