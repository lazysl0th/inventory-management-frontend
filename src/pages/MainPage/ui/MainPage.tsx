import { Container, Row, Col } from 'react-bootstrap'
import { TagsCloud } from '@/widgets/TagsCloud'
import { EnumInventorySortOrders } from '@/entities/inventory'
import { InventoryList } from '@/widgets/InventoryList'
import { SETTINGS } from '@/shared/config/constants'

const MainPage = () => {
    return (
        <Container className='pt-2 pb-5 mw-100'>
            <Row>
                <Col xs={8} sm={10} className='d-flex flex-column gap-3'>
                    <InventoryList
                        requestParams={{ sort: EnumInventorySortOrders.Latest }}
                    >
                        <h2 className='mb-0'>Latest inventories</h2>
                    </InventoryList>
                    <InventoryList
                        requestParams={{
                            sort: EnumInventorySortOrders.TopItems,
                        }}
                    >
                        <h2 className='mb-0'>Top items inventories</h2>
                    </InventoryList>
                </Col>
                <Col xs={4} sm={2}>
                    <TagsCloud
                        minFontSize={12}
                        maxFontSize={35}
                        colorOptions={SETTINGS.tagsCloudColor}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default MainPage
