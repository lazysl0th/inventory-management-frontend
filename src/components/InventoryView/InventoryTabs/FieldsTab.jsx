import { Table, Badge, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import RecordsList from "../../RecordsList/RecordsList";

export default function FieldsTab({ fields = [] }) {

    //console.log(fields)

    return (
        <div className="p-3">
            { (!fields || fields.length === 0)
                ? <Alert variant="secondary" className="m-3">No custom fields defined for this inventory.</Alert>
                : <RecordsList records={fields}/> }
        </div>
    );
}
