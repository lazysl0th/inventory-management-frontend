import { Alert, Card } from "react-bootstrap";
import CustomIdForm from "../../CustomIdBuilder/CustomIdBuilder";

export default function CustomIdTab({ parts }) {

    //console.log(customIdFormat)

    return (
        <div className="p-3">
            {parts?.length === 0 
                ? ( <Alert variant="light" className="border"> No parts defined for this Custom ID. </Alert>)
                : ( <CustomIdForm parts={parts}/> )}
            

            {parts?.summary && (
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
