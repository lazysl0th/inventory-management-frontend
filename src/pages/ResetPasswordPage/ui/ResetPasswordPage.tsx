import { ResetPasswordForm } from '@/features/auth'
import { SETTINGS } from '@/shared/config/constants'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const ResetPasswordPage = () => {
    const { t } = useTranslation('auth')

    return (
        <>
            <ResetPasswordForm />
            <div className='d-flex text-center py-5  gap-5 justify-content-center'>
                <span>
                    {t('text.existAccount') + ' '}
                    <Link
                        to={SETTINGS.routes.login}
                        className='text-decoration-underline text-dark text-nowrap'
                    >
                        {t('auth:links.signin')}
                    </Link>
                </span>
            </div>
        </>
    )
}

export default ResetPasswordPage
