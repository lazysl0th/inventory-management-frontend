import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import './ModalView.scss'
import { IModalView } from '../model/types'
import { AppModals, getModal } from '@/shared/model/ui'
import { HelpButton } from '../../HelpButton'

const modalRoot = document.getElementById('modal-root')

if (!modalRoot) throw new Error('Root modal container not found')

const ModalView = ({
    title,
    children,
    footerId,
    footer,
    ...rest
}: IModalView) => {
    const activeModal = useSelector(getModal)

    return (
        <Modal
            show={activeModal.name !== AppModals.None}
            className='modal-view'
            {...rest}
            container={modalRoot}
            centered
        >
            <Modal.Header closeButton>
                {title && (
                    <Modal.Title className='flex-grow-1'>{title}</Modal.Title>
                )}
                {activeModal.name !== AppModals.Help && <HelpButton />}
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer id={footerId}>{footer}</Modal.Footer>
        </Modal>
    )
}

export default ModalView
