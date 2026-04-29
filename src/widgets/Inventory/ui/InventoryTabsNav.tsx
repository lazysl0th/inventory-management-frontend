import { Col, Nav, Row } from 'react-bootstrap'
import { InventoryTabs } from '../model/types'
import { useTranslation } from 'react-i18next'

const InventoryTabsNav = () => {
    const { t } = useTranslation('inventory')
    return (
        <Row>
            <Col>
                <Nav variant='tabs' className='mb-3' fill>
                    {Object.values(InventoryTabs).map((tab) => (
                        <Nav.Item key={tab}>
                            <Nav.Link eventKey={tab}>
                                {t(`inventory:tabs.${tab}`)}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Col>
        </Row>
    )
}

export default InventoryTabsNav
