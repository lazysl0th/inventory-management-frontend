import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLoginByEmailMutation } from '@/features/auth/api/authApi'
import { ILoginForm } from '../model/types'
import { SETTINGS } from '@/shared/config/constants'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { signinSchema } from '../model/validations'
import {
    Checkbox,
    FloatingInput,
    FormProvider,
    SubmitButton,
} from '@/shared/ui/Form'

const LoginForm = () => {
    const [loginByEmail, { error, isSuccess }] = useLoginByEmailMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation('auth')

    const submitHandler = async (values: ILoginForm) => {
        try {
            await loginByEmail(values).unwrap()
            navigate(location.state?.from || SETTINGS.routes.profile)
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
        <FormProvider<ILoginForm>
            config={formikConfig}
            className='d-flex flex-wrap flex-column align-content-center gap-2'
        >
            <p>{t('text.paragraph')}</p>
            <h2>{t('text.headerSignin')}</h2>

            <FloatingInput
                name='email'
                label='Email'
                type='email'
                placeholder='name@example.com'
            />

            <FloatingInput
                name='password'
                label='Password'
                type='password'
                placeholder='Enter password...'
                button={ShowPasswordButton}
            />

            <Checkbox name='remember' label='Remember me' />

            <SubmitButton<ILoginForm> label={t('buttons.signin')} />

            {/*error && isFetchBaseQueryError(error) && (
                <Form.Control.Feedback
                    type='invalid'
                    className='d-flex justify-content-center'
                >
                    {(error.data as IErrorResponse).message}
                </Form.Control.Feedback>
            )*/}
        </FormProvider>
    )
}

export default LoginForm
