import { ButtonGroup } from 'react-bootstrap'
import { IActionButtonsProps } from '../model/types'
import { Button } from '../../Button'

const ActionButtons = ({ actions, ...rest }: IActionButtonsProps) => {
    return (
        <ButtonGroup {...rest}>
            {actions.map(({ icon: Icon, ...actionProps }) => (
                <Button
                    key={actionProps.name}
                    name={actionProps.name}
                    placement={actionProps.placement}
                    overlay={actionProps.overlay}
                    variant={actionProps.variant}
                    onClick={actionProps.onClickHandler}
                    disabled={actionProps.disabled}
                >
                    {Icon ? <Icon /> : null}
                </Button>
            ))}
        </ButtonGroup>
    )
}

export default ActionButtons
