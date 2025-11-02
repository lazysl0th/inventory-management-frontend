import { useState, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { GET_INVENTORIES } from '../../graphql/queries';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import RecordsList from "../RecordsList/RecordsList";
import { queryParams, nameList } from '../../utils/constants';


export default function Profile ({ handlerClickRecord, handlerDeleteRecords, handlerAddRecords }) {
    const currentUser = useContext(CurrentUserContext);

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

    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');

    const handleThemeToggle = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        document.body.dataset.bsTheme = theme === "light" ? "dark" : "light";
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        alert(`Language change: ${lang === "es" ? "Spanish" : "English"}`);
    };

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Profile</h2>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formProfileName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formProfileEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Interface</Form.Label>
                                    <Button className="w-100"
                                        variant={theme === "light" ? "outline-dark" : "outline-light"}
                                        onClick={handleThemeToggle}
                                    >
                                        {theme === "light" ? " Dark" : "Light"}
                                    </Button>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formProfileLanguage">
                                    <Form.Label>Language</Form.Label>
                                    <Form.Select
                                        value={language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formChangePassword" className="align-self-end">
                                    <Button variant="outline-secondary" className="w-100" onClick={() => alert("Change password")}>
                                        Change password
                                    </Button>{" "}
                                </Form.Group>
                            </Row>
                        </Form>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col>
                <RecordsList 
                    nameRecordList={nameList.OWNER}
                    records={myInventories?.inventories}
                    handlerClickRecord={handlerClickRecord}
                    onAdd={handlerAddRecords}
                    handlerDeleteRecords={handlerDeleteRecords}
                    onRefetch={refetch} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <RecordsList
                        nameRecordList={nameList.WRITE_ACCESS}
                        records={editableInventories?.inventories} />
                </Col>
            </Row>
        </Container>
    );
};