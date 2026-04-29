import type { IAction } from '../../ActionButtons'

export interface IActionMenuProps {
    actions: IAction[]
    className?: string
    toggleButtonTitle?: string
}
