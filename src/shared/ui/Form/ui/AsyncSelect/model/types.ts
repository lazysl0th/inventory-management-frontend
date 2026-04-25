import { GroupBase } from 'react-select'
import { AsyncProps } from 'react-select/async'

export interface IAsyncSelect<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends AsyncProps<Option, IsMulti, Group> {
    name: string
    label?: string
    helpText?: string
}
