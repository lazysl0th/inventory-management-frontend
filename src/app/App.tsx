import './styles/App.scss'
import InfoToast from '@/shared/ui/InfoToast/ui/InfoToast'
import { AppRouter } from './providers/RouterProvider'
import { ModalProvider } from './providers/ModalProvider'

export default function App() {
    return (
        <>
            <AppRouter />
            <ModalProvider />
            <InfoToast />
        </>
    )
}
