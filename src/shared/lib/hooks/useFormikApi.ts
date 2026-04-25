import { useField, useFormikContext } from 'formik'
import { ChangeEventHandler, FocusEventHandler } from 'react'

export interface IFieldApi<T> {
    value: T
    onChange: ChangeEventHandler
    onBlur: FocusEventHandler
    error?: string
    touched?: boolean
    setValue: (value: T) => void
    setError: (value: string | undefined) => void
}

interface IFormApi<T> {
    values: T
    dirty: boolean
    isSubmitting: boolean
    submitForm: () => Promise<T>
}

export function useFormikApi<T>(name: string): {
    field: IFieldApi<T>
    form: IFormApi<T>
}

export function useFormikApi<T>(): {
    form: IFormApi<T>
}

export function useFormikApi<T>(name?: string) {
    const formik = useFormikContext<T>()

    const form: IFormApi<T> = {
        values: formik.values,
        dirty: formik.dirty,
        isSubmitting: formik.isSubmitting,
        submitForm: formik.submitForm,
    }

    if (!name) return { form }

    const [field, meta, helpers] = useField<T>(name)

    const fieldApi: IFieldApi<T> = {
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        error: meta.error,
        touched: meta.touched,
        setValue: helpers.setValue,
        setError: helpers.setError,
    }

    return {
        field: fieldApi,
        form,
    }
}
