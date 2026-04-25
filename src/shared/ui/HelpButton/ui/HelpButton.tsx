import { IoIosHelpCircleOutline } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import './HelpButton.scss'
import { AppModals } from '@/shared/model/ui/model/types'
import { Button } from '../../Button'
import { openModal } from '@/shared/model/ui'

const HelpButton = () => {
    const dispatch = useDispatch()
    return (
        <Button
            variant='secondary'
            className='p-0 m-0 bg-transparent border-0'
            onClick={() => dispatch(openModal({ name: AppModals.Help }))}
        >
            <IoIosHelpCircleOutline
                size={24}
                className='text-secondary help-button--icon'
            />
        </Button>
    )
}

export default HelpButton
