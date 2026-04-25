import { useId } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { ISelectProps } from '../model/types'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'

const Select = ({
    label,
    inputPrefix,
    helpText,
    name,
    children,
    ...rest
}: ISelectProps) => {
    const { field } = useFormikApi<string>(name)
    const isInvalid = field.touched && !!field.error
    const fieldId = useId()

    return (
        <Form.Group controlId={`${name}_${fieldId}`}>
            {label && <Form.Label>{label}</Form.Label>}
            <InputGroup hasValidation>
                {inputPrefix && (
                    <InputGroup.Text id={`${name}-prepend`}>
                        {inputPrefix}
                    </InputGroup.Text>
                )}
                <Form.Select
                    onChange={field.onChange}
                    {...rest}
                    name={name}
                    value={field.value ?? ''}
                    isInvalid={isInvalid}
                >
                    {children}
                </Form.Select>
                {isInvalid && (
                    <Form.Control.Feedback type='invalid'>
                        {field.error}
                    </Form.Control.Feedback>
                )}
            </InputGroup>
            {helpText && <Form.Text muted>{helpText}</Form.Text>}
        </Form.Group>
    )
}

export default Select
