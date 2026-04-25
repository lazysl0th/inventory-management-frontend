import { IButtonProps } from '@/shared/ui/Button'

export interface ISubmitButtonProps extends IButtonProps {
    containerId?: string
    label: string
    disabled?: boolean
}
