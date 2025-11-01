import { useQuery } from "@apollo/client/react";
import { TagCloud } from 'react-tagcloud';
import { GET_INVENTORIES, GET_TAGS } from '../../graphql/queries';
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import RecordsList from '../RecordsList/RecordsList';
import { queryParams, nameList, TAGS_CLOUD_SOLOR } from '../../utils/constants';

export default function Main({ handlerClickRecord }) {

    const { data: latestInventories, loading: latestInventoriesLoading, error: latestInventoriesError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_LATEST_INVENTORIES.sortName,
            order: queryParams.GET_LATEST_INVENTORIES.order,
            take: queryParams.GET_LATEST_INVENTORIES.take,
        },
    });

    const { data: topInventories, loading: topInventoriesLoading, error: topInventoriestopError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_TOP_INVENTORIES.sortName,
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
                    { latestInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : latestInventoriesError
                            ? <Alert variant="danger" className="align-self-center">{latestInventoriesError.message}</Alert>
                            : <RecordsList
                                nameRecordList={nameList.LATEST}
                                records={latestInventories.inventories}
                                handlerClickRecord={handlerClickRecord} /> }

                    { topInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : topInventoriestopError
                            ? <Alert variant="danger" className="align-self-center">{topInventoriestopError.message}</Alert>
                            : <RecordsList 
                                nameRecordList={nameList.TOP_ITEMS}
                                records={topInventories.inventories} 
                                handlerClickRecord={handlerClickRecord} /> }
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