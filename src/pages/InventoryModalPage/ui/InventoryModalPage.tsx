import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TInventoryListItem } from '@/entities/inventory/model/types'
import { SETTINGS } from '@/shared/config/constants'
import ModalView from '@/shared/ui/ModalView/ui/ModalView'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'

const InventoryModalPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const data: TInventoryListItem = location.state?.data
    const backgroundLocation = location.state?.backgroundLocation

    const { data: inventory, inventoryId } = useInventoryData()

    const inventoryTitle = inventory?.title || data?.title || 'Inventory'

    const handleClose = () => {
        navigate(backgroundLocation || SETTINGS.routes.main)
    }

    return !backgroundLocation.pathname.includes(inventoryId) ? (
        <ModalView
            size='xl'
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
            title={inventoryTitle}
            className='modal-view-inventory'
            show={true}
            footerId='inventory-modal--footer'
        >
            <Outlet />
        </ModalView>
    ) : (
        <Outlet />
    )
}

export default InventoryModalPage
