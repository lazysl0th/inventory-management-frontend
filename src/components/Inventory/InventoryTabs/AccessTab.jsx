import { Form, Alert, Card } from "react-bootstrap";
import RecordsList from "../../RecordsList/RecordsList";
import { nameList } from "../../../utils/constants";

export default function AccessTab({ inventory, handlerChangeAllowedUsers, disabled }) {

    const { isPublic, allowedUsers = [] } = inventory;

    const handlerChange = (updatedAllowedUsers) => handlerChangeAllowedUsers('allowedUsers', updatedAllowedUsers)

    const handleChange = (e) => {
        const { name, value, checked} = e.target;
        handlerChangeAllowedUsers(name, checked);
    }

    const recordsKey = allowedUsers.map(u => u.id || u.email || "").join("|");

    return (
        <div className="p-3">
            <Card className="mb-4">
                <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-1 no-wrap">
                        <strong>Public Access:</strong>
                        <Form.Check
                        className="m-0"
                            type="checkbox"
                            name='isPublic'
                            checked={isPublic || false}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>
                    <div className="text-muted small">
                        { isPublic
                            ? "Anyone can view this inventory."
                            : "Only allowed users and admins have access." }
                    </div>
                </Card.Body>
            </Card>
            {false
                ? (<Alert variant="light" className="border">No users have been granted write access.</Alert>)
                : ( <RecordsList
                        type='User'
                        records={inventory.allowedUsers}
                        nameRecordList={nameList.ACCESS}
                        onChangeRecordList={handlerChange}
                        disabled={disabled}
                    />

            )}
        </div>
    );
}
