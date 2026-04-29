import './styles/App.scss'
import { AppRouter } from './providers/RouterProvider'
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from '@/pages/ErrorPage';
import { lazy, Suspense } from 'react';
import { Loader } from '@/shared/ui/Loader';

const ModalProvider = lazy(() => import('./providers/ModalProvider').then(module => ({ default: module.ModalProvider })));
const InfoToast = lazy(() => import('@/shared/ui/InfoToast').then(module => ({ default: module.InfoToast })));

export default function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorPage} onReset={() => { window.location.reload() }}>
            <AppRouter />
            <Suspense fallback={<Loader />}>
                <ModalProvider />
                <InfoToast />
            </Suspense>
        </ErrorBoundary>
    )
}
