import { Form } from 'react-bootstrap'
import { GroupBase, OnChangeValue } from 'react-select'
import RSAsyncSelect from 'react-select/async'
import './AsyncSelect.scss'
import { IAsyncSelect } from '../model/types'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'

export default function AsyncSelect<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({ name, label, helpText, ...rest }: IAsyncSelect<Option, IsMulti, Group>) {
    const { field } = useFormikApi<OnChangeValue<Option, IsMulti>>(name)
    const isInvalid = field.touched && !!field.error

    const handleChange = (newValue: OnChangeValue<Option, IsMulti>) => {
        field.setValue(newValue)
    }

    return (
        <Form.Group controlId={name}>
            {label && <Form.Label>{label}</Form.Label>}
            <RSAsyncSelect
                {...rest}
                inputId={name}
                menuPortalTarget={document.body}
                name={name}
                value={field.value}
                onChange={handleChange}
                onBlur={field.onBlur}
                className='async-select-container'
                classNamePrefix='async-select'
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
