import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "./apollo/client";
import './index.css'
import App from './components/App/App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ApolloProvider client={apolloClient}>
                    <App/>
            </ApolloProvider>
        </BrowserRouter>
    </StrictMode>
)
