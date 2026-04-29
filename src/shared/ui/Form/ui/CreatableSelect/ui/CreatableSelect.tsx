import RSCreatableSelect from 'react-select/creatable'
import { Form } from 'react-bootstrap'
import type { GroupBase, OnChangeValue } from 'react-select'
import type { ICreatableSelectProps } from '../model/types'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'

export default function CreatableSelect<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({
    label,
    helpText,
    name,
    ...rest
}: ICreatableSelectProps<Option, IsMulti, Group>) {
    const { field } = useFormikApi<OnChangeValue<Option, IsMulti>>(name)
    const isInvalid = field.touched && !!field.error

    const handleChange = (newValue: OnChangeValue<Option, IsMulti>) => {
        field.setValue(newValue)
    }

    return (
        <Form.Group controlId={name}>
            {label && <Form.Label>{label}</Form.Label>}
            <RSCreatableSelect
                {...rest}
                name={name}
                inputId={name}
                value={field.value}
                onChange={handleChange}
                onBlur={field.onBlur}
                openMenuOnClick={false}
            />
            {isInvalid && (
                <Form.Control.Feedback type='invalid'>
                    {field.error}
                </Form.Control.Feedback>
            )}
            {helpText && <Form.Text muted>{helpText}</Form.Text>}
        </Form.Group>
    )
}
