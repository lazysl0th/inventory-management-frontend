import { Form, Alert, Card } from "react-bootstrap";
import RecordsList from "../../RecordsList/RecordsList";
import { NAME_LIST } from "../../../utils/constants";
import { useTranslation } from 'react-i18next';

export default function AccessTab({ inventory, handlerChangeAllowedUsers, disabled }) {
    const { t } = useTranslation("inventory");

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
                        <strong>{t("labels.publicAccess")}</strong>
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
                            ? t("texts.publicAccess")
                            : t("texts.privateAccess")}
                    </div>
                </Card.Body>
            </Card>
            {false
                ? (<Alert variant="light" className="border">{t("text.noUsers")}</Alert>)
                : ( <RecordsList
                        type='User'
                        records={inventory.allowedUsers}
                        nameRecordList={NAME_LIST.ACCESS}
                        onChangeRecordList={handlerChange}
                        disabled={disabled}
                    />

            )}
        </div>
    );
}
