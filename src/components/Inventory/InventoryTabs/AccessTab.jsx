import { useState } from 'react';
import { Form, Alert, Card, Button, Toast, ToastContainer } from "react-bootstrap";
import { FaKey } from "react-icons/fa";
import RecordsList from "../../RecordsList/RecordsList";
import { NAME_LIST } from "../../../utils/constants";
import { useTranslation } from 'react-i18next';
import { getInventoryToken } from "../../../utils/tokenApi";

export default function AccessTab({ inventory, handlerChangeAllowedUsers, disabled }) {
    const { t } = useTranslation("inventory");
    const [token, setToken] = useState(false);

    const { isPublic, allowedUsers = [] } = inventory;

    const handlerChange = (updatedAllowedUsers) => handlerChangeAllowedUsers('allowedUsers', updatedAllowedUsers)

    const handleChange = (e) => {
        const { name, value, checked} = e.target;
        handlerChangeAllowedUsers(name, checked);
    }

    const getToken = async () => {
        if (token) setToken('') 
        else {
            const data = await getInventoryToken(inventory.id);
            setToken(data.apiToken);
        }
    }

    const recordsKey = allowedUsers.map(u => u.id || u.email || "").join("|");

    return (
        <div className="p-3">
            <Card className="mb-4 position-relative">
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
                    <Button type="submit" variant='dark' onClick={getToken} disabled={disabled}>
                        <FaKey /> {t("buttons.token")}
                    </Button>
                    <ToastContainer position="middle-center" className="p-3" style={{ zIndex: 1 }}>
                    <Toast show={token} animation={false} onClose={getToken} >
                        <Toast.Header>
                            <strong className="me-auto">{t("toasts.token")}</strong>
                        </Toast.Header>
                        <Toast.Body>{token}</Toast.Body>
                    </Toast>
                    </ToastContainer>
                </Card.Body>
            </Card>
            <RecordsList
                type='User'
                records={inventory.allowedUsers}
                nameRecordList={NAME_LIST.ACCESS}
                onChangeRecordList={handlerChange}
                disabled={disabled}
            />
        </div>
    );
}
