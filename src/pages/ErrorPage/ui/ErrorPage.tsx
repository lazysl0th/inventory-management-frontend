import { Container } from 'react-bootstrap'
import { FaExclamationTriangle } from 'react-icons/fa'
import type { FallbackProps } from 'react-error-boundary'
import { Button } from '@/shared/ui/Button'
import { useTranslation } from 'react-i18next'

export const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
    const { t } = useTranslation('common')

    const errorMessage =
        error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null && 'message' in error
              ? String(error.message)
              : t('common:errors.unknown')

    return (
        <Container className='d-flex flex-column justify-content-center align-items-center min-vh-100'>
            <div className='display-1 text-danger'>
                <FaExclamationTriangle />
            </div>
            <h1 className='fw-bold'>{t('common:pageTitle.errorPage')}</h1>
            <p className='text-muted'>
                {t('common:pageDescriptions.errorPage')}
            </p>

            <div className='d-grid gap-2'>
                <Button variant='dark' size='lg' onClick={resetErrorBoundary}>
                    {t('common:actions.retry')}
                </Button>
            </div>

            <small className='text-danger opacity-50 mt-2 text-truncate'>
                {errorMessage}
            </small>
        </Container>
    )
}

export default ErrorPage
