import { Col, Row, Tab } from 'react-bootstrap'
import { Outlet, useLocation } from 'react-router-dom'
import { InventoryTabs } from '@/widgets/Inventory/model/types'
/*import { InventoryForm } from '@/widgets/InventoryForm'
import { ItemList } from '@/widgets/ItemList'
import { DiscussionTab } from '@/widgets/DiscussionTab'
import { StatsTab } from '@/widgets/StatsTab'*/
import { lazy, Suspense } from 'react'
import { Loader } from '@/shared/ui/Loader'

const InventoryForm = lazy(() => import('@/widgets/InventoryForm').then(module => ({ default: module.InventoryForm })));
const ItemList = lazy(() => import('@/widgets/ItemList').then(module => ({ default: module.ItemList })));
const DiscussionTab = lazy(() => import('@/widgets/DiscussionTab').then(module => ({ default: module.DiscussionTab })));
const StatsTab = lazy(() => import('@/widgets/StatsTab').then(module => ({ default: module.StatsTab })));

const InventoryTabsPage = () => {
    const location = useLocation()
    const modalView = location.state?.modal

    return (
        <>
            <Row className='g-3 inventory overflow-auto'>
                <Col xs={12}>
                <Suspense fallback={<Loader />}>
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
                    </Suspense>
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
