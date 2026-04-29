import { FloatingLabel, Form, FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import './FloatingInput.scss'
import type { IFloatingInputProps } from '../model/types'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'

const FloatingInput = ({
    helpText,
    name,
    label,
    type,
    placeholder,
    button: Button,
    as,
    children,
    ...rest
}: IFloatingInputProps) => {
    const { t } = useTranslation('validation')
    const inputRef = useRef<HTMLInputElement>(null)
    const { field } = useFormikApi<string>(name)
    const isInvalid = field.touched && !!field.error

    return (
        <FloatingLabel {...rest} controlId={name} label={label}>
            <FormControl
                className={
                    as === 'textarea' ? 'floating-input--control-textarea' : ''
                }
                as={as}
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={name}
                value={field.value}
                aria-describedby={helpText ? `${name}-help` : undefined}
            />

            {Button && <Button ref={inputRef} />}

            <FormControl.Feedback type={'invalid'}>
                {t(`${field.error}`)}
            </FormControl.Feedback>

            {helpText && (
                <Form.Text muted id={`${name}-help`}>
                    {helpText}
                </Form.Text>
            )}
        </FloatingLabel>
    )
}

export default FloatingInput
