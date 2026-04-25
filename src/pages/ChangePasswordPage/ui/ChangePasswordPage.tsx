import { ChangePasswordForm } from '@/features/auth'
import { useTranslation } from 'react-i18next'

const ChangePasswordPage = () => {
    const { t } = useTranslation('auth')

    return <ChangePasswordForm />
}

export default ChangePasswordPage
