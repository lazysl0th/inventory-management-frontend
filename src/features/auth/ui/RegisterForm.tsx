import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import { IRegisterForm } from '../model/types'
import { signupSchema } from '../model/validations'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { isFetchBaseQueryError } from '@/shared/lib/utils'
import { IErrorResponse } from '@/types'
import { FloatingInput, FormProvider, SubmitButton } from '@/shared/ui/Form'

const RegisterForm = () => {
    const [register, { error }] = useRegisterMutation()
    const navigate = useNavigate()

    const { t } = useTranslation('auth')

    const submitHandler = async (values: IRegisterForm) => {
        await register(values).unwrap()
        navigate('/')
    }

    const initialValues = {
        email: '',
        password: '',
        name: '',
    }

    const formikConfig = {
        initialValues,
        validationSchema: signupSchema,
        onSubmit: submitHandler,
    }

    return (
        <FormProvider<IRegisterForm>
            config={formikConfig}
            className='d-flex flex-wrap flex-column align-content-center gap-2'
        >
            <p>{t('text.paragraph')}</p>
            <h2>{t('text.headerSignup')}</h2>

            <FloatingInput
                name='name'
                label='Name'
                placeholder='Enter name...'
            />

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

            <SubmitButton label={t('buttons.signup')} />

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

export default RegisterForm
