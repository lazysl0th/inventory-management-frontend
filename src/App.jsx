import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/client";
import { Container } from 'react-bootstrap'
import './App.css'

function App() {

  return (
    <ApolloProvider client={client}>
      <Container className="py-4">
        <h1 className="mb-3">Inventory Frontend</h1>
        <p className="text-muted">React + Vite + React-Bootstrap</p>
      </Container>
    </ApolloProvider>
  )
}

export default App
