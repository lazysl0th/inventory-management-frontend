import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLoginByEmailMutation } from '@/features/auth/api/authApi'
import type { ILoginForm } from '../model/types'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { signinSchema } from '../model/validations'
import {
    isBackendError,
    isFetchBaseQueryError,
    isValidationError,
} from '@/shared/lib/utils'
import { Form } from 'react-bootstrap'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { Checkbox } from '@/shared/ui/Form/ui/Checkbox'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'
import { PROFILE } from '@/shared/config/constants'

const LoginForm = () => {
    const [loginByEmail, { error }] = useLoginByEmailMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation(['auth', 'common'])

    const submitHandler = async (values: ILoginForm) => {
        try {
            await loginByEmail(values).unwrap()
            navigate(location.state?.from || PROFILE)
        } catch (e) {
            console.log(e)
        }
    }
    const initialValues = {
        email: '',
        password: '',
        remember: false,
    }

    const formikConfig = {
        initialValues,
        validationSchema: signinSchema,
        onSubmit: submitHandler,
    }

    return (
        <>
            <FormProvider<ILoginForm>
                config={formikConfig}
                className='d-flex flex-wrap flex-column align-content-center gap-2'
            >
                <p>{t('auth:formDescription')}</p>
                <h2>{t('auth:formTitle.signin')}</h2>

                <FloatingInput
                    name='email'
                    label={t('common:labels.email')}
                    type='email'
                    placeholder='name@example.com'
                />

                <FloatingInput
                    name='password'
                    label={t('auth:labels.password')}
                    type='password'
                    placeholder={t('auth:placeholders.password')}
                    button={ShowPasswordButton}
                />

                <Checkbox name='remember' label='Remember me' />

                <SubmitButton<ILoginForm> label={t('auth:actions.signin')} />
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

export default LoginForm
