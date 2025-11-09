import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { Spinner, Alert } from 'react-bootstrap';
import { GET_ITEMS, } from '../../../graphql/queries';
import RecordsList from '../../RecordsList/RecordsList';

export default function ItemsTab({
    inventoryId,
    handlerClickRecord,
    handlerAddRecord,
    handlerDeleteRecords,
    itemFields,
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
                    records={items}
                    fields={itemFields}
                    handlerAddRecord={handlerAddRecord}
                    handlerClickRecord={handlerClickRecord}
                    handlerDeleteRecords={handlerDeleteRecords} />
    );
}