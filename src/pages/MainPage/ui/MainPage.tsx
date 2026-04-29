import { Container, Row, Col } from 'react-bootstrap'
import { TagsCloud } from '@/widgets/TagsCloud'
import { useGetInventoriesQuery, EnumInventorySortOrders } from '@/entities/inventory'
import {InventoryList} from '@/widgets/InventoryList'
import { useTranslation } from 'react-i18next'
import { useGetTagsQuery } from '@/entities/tag';

const MainPage = () => {
    const { t } = useTranslation('inventory');

    const {
        data: latestInventories = [],
        isLoading: latestInventoriesLoading,
        error: latestInventoriesError,
    } = useGetInventoriesQuery({ sort: EnumInventorySortOrders.Latest })

    const {
        data: topItemsInventories = [],
        isLoading: topItemsInventoriesLoading,
        error: topItemsInventoriesError,
    } = useGetInventoriesQuery({ sort: EnumInventorySortOrders.TopItems })

    const { data: tags = [], isLoading: tagsLoading, error: tagsError, } = useGetTagsQuery()
    
    return (
        <Container className='pt-2 pb-5 mw-100'>
            <Row>
                <Col xs={12} md={8} lg={10} className='d-flex flex-column gap-3'>
                <Row>
                    <Col>
                    <InventoryList
                        isLoading={latestInventoriesLoading}
                        data={latestInventories}
                        error={latestInventoriesError}
                    >
                        <h2 className='mb-0'>{t('inventory:listTitle.latest')}</h2>
                    </InventoryList>
                    </Col>
                    </Row>
                    <Row>
                <Col>
                    <InventoryList
                        isLoading={topItemsInventoriesLoading}
                        data={topItemsInventories}
                        error={topItemsInventoriesError}
                    >
                        <h2 className='mb-0'>{t('inventory:listTitle.topItems')}</h2>
                    </InventoryList>
                    </Col></Row>
                </Col>
                <Col xs={12} md={4} lg={2}>
                    {<TagsCloud
                        minFontSize={12}
                        maxFontSize={35}
                        data={tags}
                        isLoading={tagsLoading}
                        error={tagsError}
                    />}
                </Col>
            </Row>
        </Container>
    )
}

export default MainPage
