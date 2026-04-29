import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { isBackendError, isFetchBaseQueryError, isValidationError } from '../../../shared/lib/utils'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { useChangePasswordMutation } from '@/features/auth/api/authApi'
import { changePasswordSchema } from '../model/validations'
import type { IChangePasswordForm } from '../model/types'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'
import { LOGIN } from '@/shared/config/constants'

const ChangePasswordForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('resetPasswordToken')
    const { t } = useTranslation(['auth'])
    const [changePassword, { error }] = useChangePasswordMutation()

    const submitHandler = async (values: IChangePasswordForm) => {
        const data = await changePassword(values).unwrap()
        if (data) navigate(LOGIN, { replace: true })
    }

    const initialValues = {
        password: '',
    }

    const formikConfig = {
        initialValues,
        validationSchema: changePasswordSchema,
        onSubmit: submitHandler,
    }

    return (
        <>
        <FormProvider<IChangePasswordForm>
            config={formikConfig}
            className='d-flex flex-wrap flex-column align-content-center gap-2'
        >
            <h2>{t('auth:formTitle.changePassword')}</h2>

            <FloatingInput
                name='password'
                label={t('auth:labels.password')}
                type='password'
                placeholder={t('auth:placeholders.password')}
                button={ShowPasswordButton}
            />

            <SubmitButton<IChangePasswordForm>
                label={t('auth:actions.changePassword')}
            />
        </FormProvider>
                    {error && isFetchBaseQueryError(error) && (
                <Form.Control.Feedback
                    type='invalid'
                    className='d-flex justify-content-center'
                >
                    {isValidationError(error.data) && error.data.validation.body.message || isBackendError(error.data) && error.data.message}
                </Form.Control.Feedback>
            )}
        </>
    )
}

export default ChangePasswordForm
