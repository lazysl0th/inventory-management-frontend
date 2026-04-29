import { ResetPasswordForm } from '@/features/auth'
import { LOGIN, REGISTER } from '@/shared/config/constants'
import { TextLink } from '@/shared/ui/TextLink'
import { useTranslation } from 'react-i18next'

const ResetPasswordPage = () => {
    const { t } = useTranslation('auth')

    return (
        <>
            <ResetPasswordForm />
            <div className='d-flex text-center py-5  gap-5 justify-content-center'>
                <TextLink text={t('auth:text.existAccount')} to={LOGIN} linkText={t('auth:actions.signin')}/>
                <TextLink text={t('auth:text.haveAccount')} to={REGISTER} linkText={t('auth:actions.signup')}/>
            </div>
        </>
    )
}

export default ResetPasswordPage
