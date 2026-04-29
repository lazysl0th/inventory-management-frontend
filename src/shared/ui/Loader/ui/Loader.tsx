import { Container, Spinner } from 'react-bootstrap'
import type { ILoader } from '../model/types'

const Loader = ({ className = '' }: ILoader) => {
    return (
        <Container
            className={`d-flex flex-column justify-content-center align-items-center ${className}`}
        >
            <Spinner animation='border' />
        </Container>
    )
}

export default Loader
