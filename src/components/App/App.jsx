import { ApolloProvider } from '@apollo/client/react';
import apolloClient from "../../apollo/client";
import { Container } from 'react-bootstrap'
import './App.css'
import Header from '../Header/Header';
import Main from '../Main/Main';

function App() {

  return (
    <ApolloProvider client={apolloClient}>
        <Container fluid className='d-flex flex-column gap-5'>
            <Header/>
            <Main/>
        </Container>
    </ApolloProvider>
  )
}

export default App
