import { useState, useContext } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { GET_INVENTORIES } from '../../graphql/queries';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import RecordsList from "../RecordsList/RecordsList";
import { queryParams, nameList } from '../../utils/constants';


export default function Profile ({  }) {
    const currentUser = useContext(CurrentUserContext);

    const { data: myInventories, loading: myInventoriesLoading, error: myInventoriesError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_LATEST_INVENTORIES.name,
            owner: queryParams.GET_MY_INVENTORIES.owner
        },
    });

    const { data: editableInventories, loading: editableInventoriesLoading, error: editableInventoriestopError } = useQuery(GET_INVENTORIES, {
        variables: {
            sortName: queryParams.GET_TOP_INVENTORIES.name,
            order: queryParams.GET_TOP_INVENTORIES.order,
            take: queryParams.GET_TOP_INVENTORIES.take,
        },
    });


    // ==== НАСТРОЙКИ АККАУНТА ====
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');

    const handleThemeToggle = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        document.body.dataset.bsTheme = theme === "light" ? "dark" : "light";
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        alert(`Язык изменён на: ${lang === "ru" ? "Русский" : "English"}`);
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Профиль</h2>

        {/* ======== НАСТРОЙКИ АККАУНТА ======== */}
        <Row className="mb-5">
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <strong>Настройки учётной записи</strong>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group as={Row} className="mb-3" controlId="language">
                            <Form.Label column sm={4}>
                                Язык интерфейса
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Select
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                >
                                    <option value="ru">Русский</option>
                                    <option value="en">English</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3" controlId="theme">
                            <Form.Label column sm={4}>
                                Тема
                            </Form.Label>
                            <Col sm={8}>
                                <Button
                                    variant={theme === "light" ? "outline-dark" : "outline-light"}
                                    onClick={handleThemeToggle}
                                >
                                    {theme === "light" ? "🌙 Тёмная" : "☀️ Светлая"}
                                </Button>
                            </Col>
                        </Form.Group>

                        <div className="text-end">
                            <Button variant="outline-secondary" size="sm" onClick={() => alert("Смена пароля")}>
                                Сменить пароль
                            </Button>{" "}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        <Row className="mb-5">
            <Col>
               <RecordsList nameList={nameList.OWNER} records={myInventories.inventories} />
            </Col>
        </Row>

        <Row>
            <Col>
                <RecordsList nameList={nameList.WRITE_ACCESS} records={[]} />
            </Col>
        </Row>
    </Container>
  );
};