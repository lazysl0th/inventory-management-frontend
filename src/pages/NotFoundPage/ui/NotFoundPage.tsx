import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <Container className='d-flex flex-column justify-content-center align-items-center min-vh-100'>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to='/' className='text-dark'>
                Back
            </Link>
        </Container>
    )
}

export default NotFoundPage
