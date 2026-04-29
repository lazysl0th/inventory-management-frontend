import { RegisterForm, SocialButtons } from '@/features/auth'
import { LOGIN, RESET_PASSWORD } from '@/shared/config/constants'
import { TextLink } from '@/shared/ui/TextLink'
import { useTranslation } from 'react-i18next'

const RegisterPage = () => {
    const { t } = useTranslation('auth')

    return (
        <>
            <RegisterForm />
            <SocialButtons />
            <div className='d-flex text-center py-5  gap-5 justify-content-center'>
                <TextLink
                    text={t('auth:text.existAccount')}
                    to={LOGIN}
                    linkText={t('auth:actions.signin')}
                />
                <TextLink
                    to={RESET_PASSWORD}
                    linkText={t('auth:links.forgotPassword')}
                />
            </div>
        </>
    )
}

export default RegisterPage
