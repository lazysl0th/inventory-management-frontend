import { Table, Badge, Alert, Card } from "react-bootstrap";
import RecordsList from "../../RecordsList/RecordsList";

export default function AccessTab({ inventory }) {

    //console.log(inventory)

    const { isPublic, allowedUsers = [] } = inventory;

    return (
        <div className="p-3">
            <Card className="mb-4">
                <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                        <strong>Public Access:</strong>{" "}
                        { isPublic
                            ? (<Badge bg="success">Public</Badge>)
                            : (<Badge bg="secondary">Private</Badge>) }
                    </div>
                    <div className="text-muted small">
                        { isPublic
                            ? "Anyone can view this inventory."
                            : "Only allowed users and admins have access." }
                    </div>
                </Card.Body>
            </Card>

            <h6 className="mb-3">Users with Write Access</h6>

            {allowedUsers.length === 0
                ? (<Alert variant="light" className="border">No users have been granted write access.</Alert>)
                : (<RecordsList records={allowedUsers}/>

            )}
        </div>
    );
}
