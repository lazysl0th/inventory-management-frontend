import type { TTag } from '@/entities/inventory'

export type TCreatableTag = TTag & {
    label?: React.ReactNode
    __isNew__?: boolean
}

export interface ITagsFieldProps {
    disabled?: boolean
}
