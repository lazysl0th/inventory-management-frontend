import { GroupBase } from 'react-select'
import { CreatableProps } from 'react-select/creatable'

export interface ICreatableSelectProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends CreatableProps<Option, IsMulti, Group> {
    label?: string
    helpText?: string
    name: string
}
