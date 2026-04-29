import { useDispatch, useSelector } from 'react-redux'
import { AppModals, closeModal, getModal } from '@/shared/model/ui'
import { ModalView } from '@/shared/ui/ModalView'
import { modalRegistry } from '../model/modalRegistry'
import { useTranslation } from 'react-i18next'

const modalRoot = document.getElementById('modal-root')

if (!modalRoot) throw new Error('Root modal container not found')

const ModalProvider = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation('common')

    const activeModal = useSelector(getModal)
    const infoTooltip =
        activeModal.name !== AppModals.None && modalRegistry[activeModal.name]

    if (!infoTooltip) return null

    const { titleKey, Body } = infoTooltip.infoTooltipContent

    const handleClose = () => {
        dispatch(closeModal())
    }

    return (
        <ModalView
            size='lg'
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
            title={t(`common:modalTitles.${titleKey}`)}
            footerId='infoTooltip--footer'
        >
            <Body />
        </ModalView>
    )
}

export default ModalProvider
