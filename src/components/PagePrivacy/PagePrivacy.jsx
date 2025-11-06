import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PagePrivacy () {
  return (
    <Container>
        <h1>Privacy</h1>
        <p>To obtain privacy policies, please submit a request to <a href="mailto:u69740384@gmail.com">support@inventory-management.com</a>.</p>
        <p>We will send all privacy policies to you within 24 hours.</p>
      <Link to="/">Back</Link>
    </Container>
  )
}