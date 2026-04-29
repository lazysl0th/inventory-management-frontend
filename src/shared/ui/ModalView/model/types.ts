import type { ModalProps } from 'react-bootstrap'

export interface IModalView extends ModalProps {
    title?: string
    footerId?: string
    footer?: React.ReactElement
}
