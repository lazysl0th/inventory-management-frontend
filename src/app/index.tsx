import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import { AppProviders } from './providers'
import App from './App'

const container = document.getElementById('root')

if (!container) throw new Error('Root container not found')

createRoot(container).render(
    <StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </StrictMode>
)
