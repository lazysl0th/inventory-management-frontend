import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { Card, Badge, Alert } from "react-bootstrap";
import { GET_INVENTORY_STATS } from '../../../graphql/queries';
import RecordsList from "../../RecordsList/RecordsList";
import { nameList } from "../../../utils/constants";


export default function StatsTab({ inventoryId, itemsCount }) {

    const [loadStats, { data, loading, error }] = useLazyQuery(GET_INVENTORY_STATS, {fetchPolicy: 'network-only'});

    useEffect(() => { if (inventoryId) loadStats({ variables: { id: inventoryId } }); }, [inventoryId]);

    useEffect(() => { console.log(data) }, [data]);
    useEffect(() => { console.log(data?.inventory.stats.numStats) }, [data]);
    

    if (!data?.inventory.stats.length == 0) return (<Alert variant="secondary" className="m-3"> Statistics not available for this inventory. </Alert>);

    const textStats = data?.inventory?.stats?.textStats?.flatMap((field) =>
        field.topValues.map((topValue, tvi) => ({
            id: `${field.field}_${tvi}`,
            field: field.field,
            value: topValue.value,
            count: topValue.count
        }))
    );

    return (
        <div className="p-3 d-flex flex-column gap-4">
            <div>
                <strong>Total items:</strong>{" "}<Badge bg="primary">{itemsCount}</Badge>
            </div>
            {!data?.inventory.stats.numStats?.length
                ? (<Alert variant="light" className="border">No aggregated data on numeric fields available yet.</Alert>)
                : (<RecordsList 
                    type='NumStats'
                    nameRecordList={nameList.NUM_STATS}
                    records={data?.inventory.stats.numStats}
                />)}
            {!data?.inventory.stats.textStats?.length
                ? (<Alert variant="light" className="border">No aggregated data on numeric text available yet.</Alert>)
                : (<RecordsList 
                        type='TextStats'
                        records={textStats}
                        nameRecordList={nameList.TEXT_STATS}
                    />)}
        </div>
    );
}
