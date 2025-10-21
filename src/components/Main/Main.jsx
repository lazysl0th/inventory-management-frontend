import { Container} from 'react-bootstrap';
import TableUsers from '../Table/TableUsers';

export default function Main() {

  return (
    <Container>
        <TableUsers /*users={users} onBlock={onBlock} onUnblock={onUnblock} onDelete={onDelete} onDeleteUnverified={onDeleteUnverified}*//>
    </Container>
  );
}