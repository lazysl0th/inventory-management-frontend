import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { isFetchBaseQueryError } from '../../../shared/lib/utils'
import { IErrorResponse } from '../../../types'
import { useResetPasswordMutation } from '@/features/auth/api/authApi'
import { IResetPasswordForm } from '../model/types'
import { resetPasswordSchema } from '../model/validations'
import { FloatingInput, FormProvider, SubmitButton } from '@/shared/ui/Form'

const ResetPasswordForm = () => {
    const { t } = useTranslation('auth')
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
        <FormProvider
            config={formikConfig}
            className='d-flex flex-wrap flex-column align-content-center gap-2'
        >
            <h2> {t('text.resetPassword')}</h2>

            <FloatingInput
                name='email'
                label='Email'
                type='email'
                placeholder='name@example.com'
            />
            <SubmitButton label={t('buttons.resetPassword')} />

            {error && isFetchBaseQueryError(error) && (
                <Form.Control.Feedback
                    type='invalid'
                    className='d-flex justify-content-center'
                >
                    {(error.data as IErrorResponse).message}
                </Form.Control.Feedback>
            )}
        </FormProvider>
    )
}

export default ResetPasswordForm
