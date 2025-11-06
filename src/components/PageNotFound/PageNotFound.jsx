import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PageNotFound () {
  return (
    <Container>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Back</Link>
    </Container>
  )
}