import { Dropdown } from 'react-bootstrap'
import './ActionMenu.scss'
import type { IActionMenuProps } from '../model/types'
import { Button } from '../../Button'

const ActionMenu = ({
    actions,
    className,
    toggleButtonTitle = 'Action',
}: IActionMenuProps) => {
    return (
        <Dropdown className={className}>
            <Dropdown.Toggle variant='dark'>
                {toggleButtonTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu className='p-0 border-0 dropdown-menu'>
                {actions.map(({ icon: Icon, ...actionProps }) => (
                    <Button
                        key={actionProps.name}
                        name={actionProps.name}
                        placement={actionProps.placement}
                        overlay={actionProps.overlay}
                        variant={actionProps.variant}
                    >
                        {Icon ? <Icon /> : null}
                    </Button>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ActionMenu
