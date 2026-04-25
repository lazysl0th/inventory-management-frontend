import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { isFetchBaseQueryError } from '../../../shared/lib/utils'
import { IErrorResponse } from '../../../types'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { SETTINGS } from '../../../shared/config/constants'
import { useChangePasswordMutation } from '@/features/auth/api/authApi'
import { changePasswordSchema } from '../model/validations'
import { IChangePasswordForm } from '../model/types'
import { FloatingInput, FormProvider, SubmitButton } from '@/shared/ui/Form'

const ChangePasswordForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('resetPasswordToken')
    const { t } = useTranslation('auth')
    const [changePassword, { error }] = useChangePasswordMutation()

    const submitHandler = async (values: IChangePasswordForm) => {
        const data = await changePassword(values).unwrap()
        if (data) navigate(SETTINGS.routes.login, { replace: true })
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
        <FormProvider<IChangePasswordForm>
            config={formikConfig}
            className='d-flex flex-wrap flex-column align-content-center gap-2'
        >
            <h2>{t('text.changePassword')}</h2>

            <FloatingInput
                name='password'
                label='Password'
                type='password'
                placeholder='Enter password...'
                button={ShowPasswordButton}
            />

            <SubmitButton<IChangePasswordForm>
                label={t('buttons.changePassword')}
            />
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

export default ChangePasswordForm
