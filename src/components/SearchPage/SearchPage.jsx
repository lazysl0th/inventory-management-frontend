import { useQuery } from "@apollo/client/react";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { SEARCH_INVENTORIES } from '../../graphql/inventoryQueries';
import { Spinner, Alert, Container } from 'react-bootstrap';
import RecordsList from '../RecordsList/RecordsList';
import { messageInfoTooltip, NAME_LIST, queryParams } from '../../utils/constants';


export default function SearchPage({ handlerClickRecord }) {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const { t: ts } = useTranslation("search");
    const { t: tb } = useTranslation("table");


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
                        ? <h2 className="align-self-center">{ts(messageInfoTooltip.RESULT_SEARCH.prefix)}<em>{searchQuery}</em>{ts(messageInfoTooltip.RESULT_SEARCH.suffix)}</h2>
                        : <RecordsList 
                            type='Inventory'
                            nameList={tb(NAME_LIST.SEARCH)}
                            records={data.searchInventories}
                            handlerClickRecord={handlerClickRecord} /> }
        </Container>
    );
}