import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import {
    isBackendError,
    isFetchBaseQueryError,
    isValidationError,
} from '../../../shared/lib/utils'
import { useResetPasswordMutation } from '@/features/auth/api/authApi'
import type { IResetPasswordForm } from '../model/types'
import { resetPasswordSchema } from '../model/validations'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'

const ResetPasswordForm = () => {
    const { t } = useTranslation(['auth', 'common'])
    const [resetPassword, { error }] = useResetPasswordMutation()

    const submitHandler = async (values: IResetPasswordForm) => {
        await resetPassword(values).unwrap()
    }

    const initialValues = { email: '' }

    const formikConfig = {
        initialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: submitHandler,
    }

    return (
        <>
            <FormProvider
                config={formikConfig}
                className='d-flex flex-wrap flex-column align-content-center gap-2'
            >
                <h2> {t('auth:formTitle.resetPassword')}</h2>

                <FloatingInput
                    name='email'
                    label={t('common:labels.email')}
                    type='email'
                    placeholder='name@example.com'
                />
                <SubmitButton label={t('auth:actions.resetPassword')} />
            </FormProvider>
            {error && isFetchBaseQueryError(error) && (
                <Form.Control.Feedback
                    type='invalid'
                    className='d-flex justify-content-center'
                >
                    {(isValidationError(error.data) &&
                        error.data.validation.body.message) ||
                        (isBackendError(error.data) && error.data.message)}
                </Form.Control.Feedback>
            )}
        </>
    )
}

export default ResetPasswordForm
