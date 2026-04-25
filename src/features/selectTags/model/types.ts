import { TTag } from '@/entities/inventory/model/types'

export type TCreatableTag = TTag & {
    label?: React.ReactNode
    __isNew__?: boolean
}

export interface ITagsFieldProps {
    disabled?: boolean
}
