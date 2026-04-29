import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { Button } from '../../../../Button'
import type { ISubmitButtonProps } from '../model/types'

export default function SubmitButton<T>({
    containerId,
    label,
    disabled,
    ...rest
}: ISubmitButtonProps) {
    const { form } = useFormikApi<T>()
    const [container, setContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        if (containerId) setContainer(document.getElementById(containerId))
    }, [containerId])

    return container ? (
        createPortal(
            <Button
                {...rest}
                disabled={form.isSubmitting || !form.dirty || disabled}
                type='submit'
                variant='dark'
            >
                {form.isSubmitting ? label + '...' : label}
            </Button>,
            container
        )
    ) : (
        <Button
            disabled={form.isSubmitting || !form.dirty || disabled}
            {...rest}
            type='submit'
            variant='dark'
        >
            {form.isSubmitting ? label + '...' : label}
        </Button>
    )
}
