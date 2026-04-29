import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import type { IRegisterForm } from '../model/types'
import { signupSchema } from '../model/validations'
import ShowPasswordButton from './ShowPasswordButton/ShowPasswordButton'
import { isBackendError, isFetchBaseQueryError, isValidationError } from '@/shared/lib/utils'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { FloatingInput } from '@/shared/ui/Form/ui/FloatingInput'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'

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
        <>
            <FormProvider<IRegisterForm>
                config={formikConfig}
                className='d-flex flex-wrap flex-column align-content-center gap-2'
            >
                <p>{t('auth:formDescription')}</p>
                <h2>{t('auth:formTitle.signup')}</h2>

                <FloatingInput
                    name='name'
                    label={t('common:labels.name')}
                    placeholder={t('common:placeholders.name')}
                />

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

                <SubmitButton label={t('auth:actions.signup')} />
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

export default RegisterForm
