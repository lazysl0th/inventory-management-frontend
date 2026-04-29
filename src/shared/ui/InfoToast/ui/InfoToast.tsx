import { Toast, ToastContainer } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getToast, hideToast } from '@/shared/model/ui'
import { CLOSE_INFO_TOAST } from '@/shared/config/constants'

const InfoToast = () => {
    const dispatch = useDispatch()
    const toastState = useSelector(getToast)
    const closeHandle = () => dispatch(hideToast())

    return (
        <ToastContainer
            position={toastState.header ? 'middle-center' : 'bottom-end'}
            className='p-3 position-fixed'
        >
            <Toast
                show={toastState.show}
                onClose={closeHandle}
                delay={toastState.header ? undefined : CLOSE_INFO_TOAST}
                autohide={!toastState.header}
                bg={toastState.header ? 'dark' : 'warning'}
            >
                {toastState.header && (
                    <Toast.Header>
                        <strong className='me-auto'>{toastState.header}</strong>
                    </Toast.Header>
                )}
                <Toast.Body className={toastState.header && 'text-white'}>
                    {toastState.message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default InfoToast
