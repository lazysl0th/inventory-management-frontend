import { Col, Nav, Row } from 'react-bootstrap'
import { InventoryTabs } from '../model/types'

const InventoryTabsNav = () => {
    return (
        <Row>
            <Col>
                <Nav variant='tabs' className='mb-3' fill>
                    {Object.entries(InventoryTabs).map(([title, eventKey]) => (
                        <Nav.Item key={eventKey}>
                            <Nav.Link eventKey={eventKey}>{title}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Col>
        </Row>
    )
}

export default InventoryTabsNav
