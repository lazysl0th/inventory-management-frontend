import { useQuery } from "@apollo/client/react";
import { useSearchParams } from 'react-router-dom';
import { SEARCH_INVENTORIES } from '../../graphql/queries';
import { Spinner, Alert, Container } from 'react-bootstrap';
import RecordsList from '../RecordsList/RecordsList';
import { messageInfoTooltip, nameList, queryParams } from '../../utils/constants';


export default function SearchPage({ handlerClickRecord }) {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

    const { data, loading, error } = useQuery(SEARCH_INVENTORIES, {
        variables: { searchQuery, orderBy: queryParams.SEARCH_INVENTORIES.orderBy },
    })

    return (
        <Container fluid className="d-flex flex-column gap-4">
            { loading 
                ? <Spinner animation="border" className="align-self-center"/>
                : error
                    ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                    : data.searchInventories.length === 0 
                        ? <h2 className="align-self-center">{messageInfoTooltip.RESULT_SEARCH.prefix}<em>{searchQuery}</em>{messageInfoTooltip.RESULT_SEARCH.suffix}</h2>
                        : <RecordsList 
                            type='Inventory'
                            nameList={nameList.SEARCH}
                            records={data.searchInventories}
                            handlerClickRecord={handlerClickRecord} /> }
        </Container>
    );
}