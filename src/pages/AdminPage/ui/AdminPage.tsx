import { Container, Row, Col } from 'react-bootstrap'
import { InventoryList } from '@/widgets/InventoryList'
import { UserList } from '@/widgets/UserList'

export default function AdminPage() {
    return (
        <Container className='d-flex flex-column gap-4 mw-100'>
            <Row>
                <Col className='d-flex flex-column gap-4'>
                    <h2 className='mb-2'>Admin panel</h2>
                    <UserList tableId='users'>
                        <h2 className='mb-0'>Users</h2>
                    </UserList>
                    <InventoryList
                        requestParams={{}}
                        tableId='allInventories'
                        actionButtons={true}
                    >
                        <h2 className='mb-0'>All inventories</h2>
                    </InventoryList>
                </Col>
            </Row>
        </Container>
    )
}
