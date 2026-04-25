import { Tab } from 'react-bootstrap'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import './Inventory.scss'
import { InventoryTabs } from '../model/types'
import InventoryTabsNav from './InventoryTabsNav'
import { useInventoryData } from '@/entities/inventory'

const Inventory = () => {
    const { activeTab } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useInventoryData()

    const handleSelectTab = (eventKey: string | null): void => {
        navigate(`${eventKey}`, {
            state: {
                backgroundLocation: location.state?.backgroundLocation || null,
                modal: location.state?.modal || null,
                activeTab: eventKey,
            },
            relative: 'route',
        })
    }

    return (
        <Tab.Container
            activeKey={
                activeTab ?? location.state?.activeTab ?? InventoryTabs.Details
            }
            onSelect={handleSelectTab}
        >
            <InventoryTabsNav />
            <Outlet />
        </Tab.Container>
    )
}
export default Inventory
