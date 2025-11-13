import { useContext, useState, useEffect } from 'react';
import { Modal, Spinner, Alert, Form, Row, Col, ListGroup } from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { useTranslation } from 'react-i18next';
import { getUser } from '../../utils/usersApi';
import useAccess from '../../hooks/useAccess';
import { initialStateUser } from '../../utils/constants';

function User({
    isOpen,
    userId,
    handlerCloseView,
}) {
    const currentUser = useContext(CurrentUserContext);
    const [user, setUser] = useState(initialStateUser)
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation("admin");
    const { t: tp } = useTranslation("profile");

    useEffect(() => {
        if (userId) {
            handleLoadUser(userId);
        }
    }, [isOpen, userId]);

    const handleCloseView = () => {
        handlerCloseView();
        setUser(initialStateUser);
    }

    const handleLoadUser = async (id) => {
        try {
            setIsLoading(true)
            const userData = await getUser(id);
            console.log(userData);
            setUser(userData)
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (

        
        <Modal
            show={isOpen}
            onHide={handleCloseView}
            size="lg"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className={(isLoading || user.id === null) && "align-self-center"}>
                {isLoading
                    ? <Spinner animation="border"/>
                    : user.id === null
                        ? (<div className="d-flex justify-content-center align-items-center">
                                <Alert variant="danger" className="align-self-center">{t("alerts.users")}</Alert>
                            </div>)
                        : <Form>
                                <Row className="mb-3 justify-content-between">
                                    <Form.Group as={Col} xs={12} sm={6} className="mt-2" controlId="formUserName">
                                        <Form.Label>{tp("labels.name")}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name"
                                            value={user.name ?? ''}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} sm={6} className="mt-2" controlId="formUserEmail">
                                        <Form.Label>{tp("labels.email")}</Form.Label>
                                          <Form.Control 
                                            type="email" 
                                            name="email"
                                            value={user.email ?? ''}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} sm={6} className="mt-2" controlId="formUserGoogleId">
                                        <Form.Label>{tp("labels.googleId")}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="googleId"
                                            value={user.googleId ?? ''}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} sm={6} className="mt-2" controlId="formUserFacebookId">
                                        <Form.Label>{tp("labels.facebookId")}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="facebookId"
                                            value={user.facebookId ?? ''}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} sm={6} className="mt-2" controlId="formUserStatus">
                                        <Form.Label>{tp("labels.status")}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="status"
                                            value={user.status ?? ''}
                                            disabled
                                        />
                                    </Form.Group>
                                    <ListGroup as={Col} xs={12} sm={6} className="mt-2">
                                        <ListGroup.Item className="d-flex align-items-start">
                                            {tp("labels.roles")}
                                        </ListGroup.Item>
                                        {user.roles.map((role, i) => (
                                            <ListGroup.Item
                                                key={role.role.id}
                                                className="d-flex align-items-start"
                                            >
                                                {role.role.name}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Row>
                            </Form> }
            </Modal.Body>
        </Modal>
    );
}

export default User;