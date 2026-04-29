import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

const FullPageLayout: React.FC = () => {
    return (
        <Container className='d-flex flex-column justify-content-center align-items-center min-vh-100'>
            <Outlet />
        </Container>
    )
}

export default FullPageLayout
