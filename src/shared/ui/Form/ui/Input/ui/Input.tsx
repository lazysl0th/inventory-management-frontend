import { Form, FormControl, InputGroup } from 'react-bootstrap'
import { forwardRef, type ForwardRefRenderFunction, useId } from 'react'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import type { IInputProps, InputElement } from '../model/types'
import { ImagePreview } from '@/shared/ui/ImagePreview'

const Input: ForwardRefRenderFunction<InputElement, IInputProps> = (
    {
        label,
        inputPrefix,
        helpText,
        imageUrl,
        name,
        type,
        rows,
        children,
        api,
        ...rest
    },
    ref
) => {
    const { field } = api ? api : useFormikApi<string>(name)
    const isInvalid = field.touched && !!field.error
    const fieldId = useId()

    return (
        <Form.Group controlId={`${name}_${fieldId}`}>
            {label && <Form.Label>{label}</Form.Label>}
            {type === 'file' && <ImagePreview imageUrl={field.value} alt={rest.alt} placeholder={rest.placeholder}/>}
            <InputGroup hasValidation>
                {inputPrefix && (
                    <InputGroup.Text id={`${name}-prepend`}>
                        {inputPrefix}
                    </InputGroup.Text>
                )}
                <FormControl
                    onChange={field.onChange}
                    value={type === 'file' ? undefined : field.value || ''}
                    {...rest}
                    ref={ref}
                    onBlur={field.onBlur}
                    name={name}
                    type={type}
                    rows={rows}
                    isInvalid={isInvalid}
                    aria-describedby={helpText ? `${name}-help` : undefined}
                />
                {children}
                <FormControl.Feedback type='invalid'>
                    {field.error}
                </FormControl.Feedback>
            </InputGroup>
            {helpText && (
                <Form.Text muted id={`${name}-help`}>
                    {helpText}
                </Form.Text>
            )}
        </Form.Group>
    )
}

export default forwardRef(Input)
