import { LoginForm, SocialButtons } from '@/features/auth'
import { REGISTER, RESET_PASSWORD } from '@/shared/config/constants'
import { TextLink } from '@/shared/ui/TextLink'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
    const { t } = useTranslation('auth')
    return (
        <>
            <LoginForm />
            <SocialButtons />
            <div className='d-flex text-center py-5 gap-5 justify-content-center'>
                <TextLink
                    text={t('auth:text.haveAccount')}
                    to={REGISTER}
                    linkText={t('auth:actions.signup')}
                />
                <TextLink
                    to={RESET_PASSWORD}
                    linkText={t('auth:links.forgotPassword')}
                />
            </div>
        </>
    )
}

export default LoginPage
