import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "./apollo/client";
import './index.css'
import App from './components/App/App.jsx'

window.addEventListener('error', (event) => {
  console.error('🔥 Global Error:', event.message, event.filename, event.lineno, event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled Promise Rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ApolloProvider client={apolloClient}>
                    <App/>
            </ApolloProvider>
        </BrowserRouter>
    </StrictMode>
)
