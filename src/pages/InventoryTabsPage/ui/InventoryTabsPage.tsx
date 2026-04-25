import { Col, Row, Tab } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'
import { InventoryTabs } from '@/widgets/Inventory/model/types'
import InventoryForm from '@/widgets/InventoryForm/ui/InventoryForm'
import { ItemList } from '@/widgets/ItemList'
import { DiscussionTab } from '@/widgets/DisscussionTab'
import { StatsTab } from '@/widgets/StatsTab'

const InventoryTabsPage = () => {
    const location = useLocation()
    const modalView = location.state?.modal

    return (
        <>
            <Row className='g-3 inventory overflow-auto'>
                <Col xs={12}>
                    <InventoryForm />
                    <Tab.Content>
                        <Tab.Pane eventKey={InventoryTabs.Items}>
                            <ItemList tableId='items' />
                        </Tab.Pane>
                        <Tab.Pane eventKey={InventoryTabs.Discussion}>
                            <DiscussionTab />
                        </Tab.Pane>
                        <Tab.Pane eventKey={InventoryTabs.Stats}>
                            <StatsTab />
                        </Tab.Pane>
                        <Tab.Pane eventKey={InventoryTabs.Export}></Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
            {!modalView && (
                <Row className='mt-5'>
                    <Col
                        id='inventory--submit-button'
                        className='d-flex justify-content-end'
                    />
                </Row>
            )}
            <Outlet />
        </>
    )
}

export default InventoryTabsPage
