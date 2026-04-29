import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { FloatingLabel, Form, FormControl, FormSelect } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import type { IFloatingSelectProps } from '../model/types'

const FloatingSelect = ({
    helpText,
    name,
    label,
    children,
    ...rest
}: IFloatingSelectProps) => {
    const { t } = useTranslation('validation')
    const { field } = useFormikApi<string>(name)
    const isInvalid = field.touched && !!field.error

    return (
        <FloatingLabel {...rest} controlId={name} label={label}>
            <FormSelect
                isInvalid={isInvalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={name}
                value={field.value}
                aria-describedby={helpText ? `${name}-help` : undefined}
            >
                {children}
            </FormSelect>

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

export default FloatingSelect
