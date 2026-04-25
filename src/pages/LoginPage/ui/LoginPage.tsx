import { LoginForm } from '@/features/auth'
import { SocialButtons } from '@/features/socialAuth'
import { SETTINGS } from '@/shared/config/constants'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    const { t } = useTranslation('auth')

    return (
        <>
            <LoginForm />
            <SocialButtons />
            <div className='d-flex text-center py-5  gap-5 justify-content-center'>
                <span>
                    {t('auth:text.haveAccount') + ' '}
                    <Link
                        to={SETTINGS.routes.register}
                        className='text-decoration-underline text-dark text-nowrap'
                    >
                        {t('auth:links.signup')}
                    </Link>
                </span>
                <Link
                    to={SETTINGS.routes.resetPassword}
                    className='text-decoration-underline text-dark'
                >
                    {t('auth:links.forgotPassword')}
                </Link>
            </div>
        </>
    )
}

export default LoginPage
