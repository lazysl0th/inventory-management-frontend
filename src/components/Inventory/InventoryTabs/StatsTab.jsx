import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { Badge, Alert } from "react-bootstrap";
import { GET_INVENTORY_STATS } from '../../../graphql/queries';
import RecordsList from "../../RecordsList/RecordsList";
import { NAME_LIST } from "../../../utils/constants";
import { useTranslation } from 'react-i18next';

export default function StatsTab({ inventoryId, itemsCount }) {
    const { t } = useTranslation("inventory");

    const [loadStats, { data, loading, error }] = useLazyQuery(GET_INVENTORY_STATS, {fetchPolicy: 'network-only'});

    useEffect(() => { if (inventoryId) loadStats({ variables: { id: inventoryId } }); }, [inventoryId]);    

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
                <strong>{t("badges.totalItems")}</strong>{" "}<Badge bg="primary">{itemsCount}</Badge>
            </div>
            {!data?.inventory.stats.numStats?.length
                ? (<Alert variant="light" className="border">{t("texts.noStatsText")}</Alert>)
                : (<RecordsList 
                    type='NumStats'
                    nameRecordList={NAME_LIST.NUM_STATS}
                    records={data?.inventory.stats.numStats}
                />)}
            {!data?.inventory.stats.textStats?.length
                ? (<Alert variant="light" className="border">{t("texts.noStatsNum")}</Alert>)
                : (<RecordsList 
                        type='TextStats'
                        records={textStats}
                        nameRecordList={NAME_LIST.TEXT_STATS}
                    />)}
        </div>
    );
}
