import { Table, Alert, Card } from "react-bootstrap";
import RecordsList from "../../RecordsList/RecordsList";

export default function CustomIdTab({ customIdFormat }) {

    //console.log(customIdFormat)

    if (!customIdFormat) return ( <Alert variant="secondary" className="m-3"> Custom ID format is not defined. </Alert> );

    return (
        <div className="p-3">
            {customIdFormat.parts.length === 0 
                ? ( <Alert variant="light" className="border"> No parts defined for this Custom ID. </Alert>)
                : ( <RecordsList records={customIdFormat.parts}/> )}

            {customIdFormat.summary && (
                <Card className="mt-3">
                    <Card.Header>Generated ID Preview</Card.Header>
                    <Card.Body>
                        <Card.Text className="fs-5 fw-semibold text-primary"> {customIdFormat.summary} </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}
