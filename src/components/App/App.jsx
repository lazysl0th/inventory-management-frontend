import { ApolloProvider } from '@apollo/client/react';
import apolloClient from "../../apollo/client";
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import Header from '../Header/Header';
import Main from '../Main/Main';
import Register from '../Register/Register';
import * as userApi from '../../utils/usersApi';
import InfoTooltip from '../infoTooltip/infoTooltip';
import { titleInfoTooltip, messageInfoTooltip } from '../../utils/constants';

function App() {
    const [infoTooltipTitle, setInfoTooltipTitle] = useState('');
    const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
    const [isInfoTooltipOpen,  setIsInfoTooltipOpen] = useState(false);
    const navigate = useNavigate();

    const openInfoTooltip = (title, message) => {
        setInfoTooltipTitle(title);
        setInfoTooltipMessage(message);
        setIsInfoTooltipOpen(true);
    }

    const handleCloseInfoTooltip = () => {
        setIsInfoTooltipOpen(false);
        setInfoTooltipTitle('');
        setInfoTooltipMessage('');
    }

    const handleSignUpSubmit = async (values) => {
        try {
            const userData = await userApi.register(values);
            if (userData) {
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.REGISTRATION.SUCCESS)
                navigate('/');
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.REGISTRATION.ERROR);
            }
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    return (
        <ApolloProvider client={apolloClient}>
            <Routes>
                <Route path="/" element={
                    <>
                        <Header />
                        <Main />
                    </>
                }/>
                <Route path="/sign-up" element={<Register onReg={handleSignUpSubmit}/>} />
            </Routes>
            <InfoTooltip isOpen={isInfoTooltipOpen} onClose={handleCloseInfoTooltip} title={infoTooltipTitle} message={infoTooltipMessage} />
        </ApolloProvider>
    )
}

export default App
