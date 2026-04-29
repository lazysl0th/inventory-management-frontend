import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { type IItemListItem, useGetItemQuery } from '@/entities/item'
import { Item } from '@/widgets/Item'
import { ModalView } from '@/shared/ui/ModalView'
import { MAIN } from '@/shared/config/constants'

const ItemModalPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const data: IItemListItem = location.state?.data
    const { inventoryId, itemId } = useParams()
    const backgroundLocation = location.state?.backgroundLocation

    const {
        data: item,
        isLoading: itemIsLoading,
        error: itemError,
        isSuccess: itemIsSuccess,
    } = useGetItemQuery(
        inventoryId && itemId && itemId !== 'new'
            ? { inventoryId, itemId }
            : skipToken
    )

    const itemTitle = item?.customId || data?.customId || 'Item'

    const handleClose = () => {
        backgroundLocation ? navigate(-1) : navigate(MAIN)
    }

    return (
        <ModalView
            size='lg'
            className='modal-view-item'
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
            title={itemTitle}
            show={true}
            footerId='item-modal--footer'
        >
            <Item />
        </ModalView>
    )
}

export default ItemModalPage
