import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PageDeleteUserData () {
  return (
    <Container>
        <h1>Deleting user data</h1>
        <p>To delete your data, please submit a request to <a href="mailto:u69740384@gmail.com">support@inventory-management.com</a>.</p>
        <p>We will delete all data related to you within 24 hours.</p>
      <Link to="/">Back</Link>
    </Container>
  )
}