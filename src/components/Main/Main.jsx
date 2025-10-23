import { useQuery } from "@apollo/client/react";
import { TagCloud } from 'react-tagcloud';
import { GET_LATEST_INVENTORIES, GET_TOP_INVENTORIES, GET_TAGS } from '../../graphql/queries';
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import RercordsList from '../RercordsList/RercordsList';
import { queryParams, nameList, tagCloudColor } from '../../utils/constants';

export default function Main({}) {
    const { data: latestInventoris, loading: latestInventorisLoading, error: latestInventorisError } = useQuery(GET_LATEST_INVENTORIES, {
        variables: {
            orderBy: { createdAt: queryParams.GET_LATEST_INVENTORIES.createdAt },
            take: queryParams.GET_LATEST_INVENTORIES.take,
        },
    });

    const { data: topInventories, loading: topInventoriesLoading, error: topInventoriestopError } = useQuery(GET_TOP_INVENTORIES, {
        variables: {
            orderBy: { itemsCount: queryParams.GET_TOP_INVENTORIES.itemsCount },
            take: queryParams.GET_TOP_INVENTORIES.take,
        },
    });

    const { data: tags, loading: tagsLoading, error: tagsError } = useQuery(GET_TAGS);

    const cloudTagData = tags?.selectTags.map((tag) => ({ value: tag.name, count: tag.inventoriesCount })) || []
    console.log(cloudTagData);

    return (
        <Container fluid className="d-flex flex-column gap-4">
            <Row>
                <Col xs={11} className="d-flex flex-column gap-4">
                    { latestInventorisLoading 
                        ? <Spinner animation="border" />
                        : latestInventorisError
                            ? <Alert variant="danger">{latestInventorisError.message}</Alert>
                            : <RercordsList nameList={nameList.LATEST} records={latestInventoris.selectInventories} /> }
                    { topInventoriesLoading 
                        ? <Spinner animation="border" />
                        : topInventoriestopError
                            ? <Alert variant="danger">{topInventoriestopError.message}</Alert>
                            : <RercordsList nameList={nameList.TOP_ITEMS} records={topInventories.selectInventories} /> }
                    
                </Col>
                <Col xs={1}>
                    <TagCloud
                        minSize={12}
                        maxSize={35}
                        tags={cloudTagData}
                        colorOptions={tagCloudColor}
                    />
                </Col>
            </Row>
            
            
        </Container>
    );
}