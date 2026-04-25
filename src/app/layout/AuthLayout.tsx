import { Container, Row, Col } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { AuthHeader } from '@/widgets/AuthHeader'

const AuthLayout: React.FC = () => {
    return (
        <Container fluid className='min-vh-100 align-content-center'>
            <Row>
                <Col xs={12} md={6}>
                    <AuthHeader />
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}

export default AuthLayout
