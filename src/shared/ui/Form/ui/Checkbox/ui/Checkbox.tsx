import { Form, InputGroup } from 'react-bootstrap'
import { useId } from 'react'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import type { ICheckProps } from '../model/types'

const Checkbox = ({
    inputPrefix,
    helpText,
    name,
    feedback,
    ...rest
}: ICheckProps) => {
    const { field } = useFormikApi<boolean>(name)
    const isInvalid = field.touched && !!field.error
    const fieldId = useId()

    return (
        <Form.Group controlId={`${name}_${fieldId}`}>
            <InputGroup hasValidation>
                {inputPrefix && (
                    <InputGroup.Text id={`${name}-prepend`}>
                        {inputPrefix}
                    </InputGroup.Text>
                )}
                <Form.Check
                    {...rest}
                    onChange={field.onChange}
                    name={name}
                    checked={field.value || false}
                    isInvalid={isInvalid}
                    feedback={field.error}
                    feedbackType='invalid'
                />
            </InputGroup>
            {helpText && <Form.Text muted>{helpText}</Form.Text>}
        </Form.Group>
    )
}

export default Checkbox
