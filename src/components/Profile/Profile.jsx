import { useState, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { Container, Row, Col, Button, Form, Spinner, Alert} from "react-bootstrap";
import { GET_INVENTORIES } from '../../graphql/queries';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import RecordsList from "../RecordsList/RecordsList";
import { queryParams, NAME_LIST } from '../../utils/constants';
import { useTranslation } from 'react-i18next';


export default function Profile ({ handlerClickRecord, handlerDeleteRecords, handlerAddRecord }) {
    const currentUser = useContext(CurrentUserContext);
    const { t, i18n } = useTranslation("profile");
    const { t: ta } = useTranslation("auth");
    const [theme, setTheme] = useState('light');
    const currentLang = i18n.language;

    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    const { data: myInventories, loading: myInventoriesLoading, error: myInventoriesError, refetch } = useQuery(GET_INVENTORIES, {
        variables: { ownerId: currentUser.id },
    });

    const { data: editableInventories, loading: editableInventoriesLoading, error: editableInventoriestopError } = useQuery(GET_INVENTORIES, {
        variables: {
            isPublic: queryParams.GET_EDITABLE_INVENTORIES.isPublic,
            allowedUser: currentUser.id,
            logic: queryParams.GET_EDITABLE_INVENTORIES.logic
        },
    });



    const handleThemeToggle = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        document.body.dataset.bsTheme = theme === "light" ? "dark" : "light";
    };



    return (
        <Container className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Profile</h2>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formProfileName">
                                    <Form.Label>{t("labels.name")}</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formProfileEmail">
                                    <Form.Label>{t("labels.email")}</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>{t("labels.interface")}</Form.Label>
                                    <Button className="w-100"
                                        variant={theme === "light" ? "outline-dark" : "outline-light"}
                                        onClick={handleThemeToggle}
                                    >
                                        {theme === "light" ? t("buttons.dark") : t("buttons.light")}
                                    </Button>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formProfileLanguage">
                                    <Form.Label>{t("labels.language")}</Form.Label>
                                    <Form.Select
                                        value={currentLang}
                                        onChange={handleChangeLanguage}
                                    >
                                        <option value="en">{t("options.english")}</option>
                                        <option value="es">{t("options.spanish")}</option>
                                        <option value="ua">{t("options.ukrainian")}</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formChangePassword" className="align-self-end">
                                    <Button variant="outline-secondary" className="w-100" onClick={() => alert("Change password")}>
                                        {ta("buttons.changePassword")}
                                    </Button>{" "}
                                </Form.Group>
                            </Row>
                        </Form>
                </Col>
            </Row>
            <Row className="mb-5 mt-3">
                <Col className="d-flex flex-column gap-4" >
                    { myInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : myInventoriesError
                            ? <Alert variant="danger" className="align-self-center">{myInventoriesError.message}</Alert>
                            : <RecordsList
                                type='Inventory'
                                nameRecordList={NAME_LIST.OWNER}
                                records={myInventories?.inventories}
                                handlerClickRecord={handlerClickRecord}
                                handlerAddRecord={handlerAddRecord}
                                handlerDeleteRecords={handlerDeleteRecords}
                            />}
                </Col>
            </Row>

            <Row>
                <Col className="d-flex flex-column gap-4" >
                    { editableInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : editableInventoriestopError
                            ? <Alert variant="danger" className="align-self-center">{editableInventoriestopError.message}</Alert>
                            : <RecordsList
                                type='Inventory'
                                nameRecordList={NAME_LIST.WRITE_ACCESS}
                                records={editableInventories?.inventories}
                                handlerClickRecord={handlerClickRecord}
                            />}
                </Col>
            </Row>
        </Container>
    );
};