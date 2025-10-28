import { useQuery } from "@apollo/client/react";
import { TagCloud } from 'react-tagcloud';
import { GET_INVENTORIES, GET_TAGS } from '../../graphql/queries';
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import RecordsList from '../RecordsList/RecordsList';
import { queryParams, nameList, TAGS_CLOUD_SOLOR } from '../../utils/constants';

export default function Main({ handlerRecordClick }) {

    const { data: latestInventoris, loading: latestInventorisLoading, error: latestInventorisError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_LATEST_INVENTORIES.name,
            order: queryParams.GET_LATEST_INVENTORIES.order,
            take: queryParams.GET_LATEST_INVENTORIES.take,
        },
    });

    const { data: topInventories, loading: topInventoriesLoading, error: topInventoriestopError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_TOP_INVENTORIES.name,
            order: queryParams.GET_TOP_INVENTORIES.order,
            take: queryParams.GET_TOP_INVENTORIES.take,
        },
    });


    const { data: tags, loading: tagsLoading, error: tagsError } = useQuery(GET_TAGS);
    const cloudTagData = tags?.tags.map((tag) => ({ value: tag.name, count: tag.inventoriesCount })) || []

    return (
        <Container className="d-flex flex-column gap-4" >
            <Row>
                <Col xs={11} className="d-flex flex-column gap-4">
                    { latestInventorisLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : latestInventorisError
                            ? <Alert variant="danger" className="align-self-center">{latestInventorisError.message}</Alert>
                            : <RecordsList
                                nameList={nameList.LATEST}
                                records={latestInventoris.inventories}
                                handlerRecordClick={handlerRecordClick} /> }

                    { topInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : topInventoriestopError
                            ? <Alert variant="danger" className="align-self-center">{topInventoriestopError.message}</Alert>
                            : <RecordsList 
                                nameList={nameList.TOP_ITEMS}
                                records={topInventories.inventories} 
                                handlerRecordClick={handlerRecordClick} /> }
                </Col>
                <Col xs={1}>
                    <TagCloud
                        minSize={12}
                        maxSize={35}
                        tags={cloudTagData}
                        colorOptions={TAGS_CLOUD_SOLOR}
                    />
                </Col>
            </Row>
            
            
        </Container>
    );
}