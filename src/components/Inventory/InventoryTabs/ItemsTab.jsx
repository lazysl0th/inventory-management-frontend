import { useQuery } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';
import { GET_ITEMS } from '../../../graphql/itemQuery';
import RecordsList from '../../RecordsList/RecordsList';

export default function ItemsTab({
    inventoryId,
    handlerClickRecord,
    handlerAddRecord,
    handlerDeleteRecords,
    itemFields,
    disabled
}) {
    const { data, loading, error } = useQuery(GET_ITEMS, { 
        variables: { inventoryId },
        skip: !inventoryId });
    
    const items = data?.items || [];

    return (
        loading
            ? (<div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" className="align-self-center"/>
            </div>)
            : error
                ? (<div className="d-flex justify-content-center align-items-center">
                    <Alert variant="danger">{error.message}</Alert>
                    </div>)
                : <RecordsList type='Item'
                    inventoryId={inventoryId}
                    records={items}
                    fields={itemFields}
                    handlerAddRecord={handlerAddRecord}
                    handlerClickRecord={handlerClickRecord}
                    handlerDeleteRecords={handlerDeleteRecords}
                    disabled={disabled} />
    );
}