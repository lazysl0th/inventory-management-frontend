import { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { Container, Row, Col, Button, Form, Spinner, Alert} from "react-bootstrap";
import { CiLight } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import { GET_INVENTORIES } from '../../graphql/inventoryQueries';
import RecordsList from "../RecordsList/RecordsList";
import { queryParams, NAME_LIST, link } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import FormValidation from '../FormValidator/FormValidator';
import { ProfileSchema } from '../../utils/validationSchema';
import { updateProfile, getUser } from '../../utils/usersApi';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from "../../context/CurrentUserContext";
import useAccess from '../../hooks/useAccess';
import AdditionalInfo from "./AdditionalInfo/AdditionalInfo"; 

export default function Profile ({ handlerClickRecord, handlerDeleteRecords, handlerAddRecord, onShowToast, onSupportRequest }) {
    const currentUser = useContext(CurrentUserContext);
    const { id: routeUserId } = useParams(); 
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [personalData, setPersonalData] = useState({ name: '', email: '' });
    const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false)
    const [theme, setTheme] = useState('light');
    const { t, i18n } = useTranslation("profile");
    const currentLang = i18n.language;
    const targetUserId = (routeUserId ? Number(routeUserId) : currentUser?.id);
    const isOwner = (currentUser?.id === targetUserId);
    const { readOnly } = useAccess([]);

    useEffect(() => {
        if (isOwner) {
            setPersonalData({
                name: currentUser.name,
                email: currentUser.email
            })
        } else {
            handleLoadUser(targetUserId);
        }
    }, [targetUserId]);

    const handleLoadUser = async (id) => {
        try {
            setIsLoading(true)
            const userData = await getUser(id);
            setPersonalData({
                name: userData.name,
                email: userData.email
            })
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditProfile = async (values) => {
        isEdit ? await submitUpdateProfileHandler(values, !isOwner ? targetUserId : null) : setIsEdit(true);
    }

    const submitUpdateProfileHandler = async(values, userId) => {
        try {
            const userData = await updateProfile(values, userId);
            if (userData) {
                setPersonalData((prevData) => ({
                    ...prevData,
                    ...userData,
                }))
                setIsEdit(false);
                onShowToast(t("toasts.updateUserSucces"), 'bottom-center');
            } else {
                onShowToast(t("toasts.updateUserFailed"), 'bottom-center');
            }
        } catch (e) {
            console.log(e);
            onShowToast(e.message, 'bottom-center');
        } finally {
            setIsEdit(false)
        }
    }
    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    const { data: myInventories, loading: myInventoriesLoading, error: myInventoriesError, refetch } = useQuery(GET_INVENTORIES, {
        variables: { ownerId: currentUser?.id },
    });

    const { data: editableInventories, loading: editableInventoriesLoading, error: editableInventoriestopError } = useQuery(GET_INVENTORIES, {
        variables: {
            isPublic: queryParams.GET_EDITABLE_INVENTORIES.isPublic,
            allowedUser: currentUser?.id,
            logic: queryParams.GET_EDITABLE_INVENTORIES.logic
        },
    });

    const handleThemeToggle = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        document.body.dataset.bsTheme = theme === "light" ? "dark" : "light";
    };

    const openAdditionalInfo = () => {
        setIsAdditionalInfoOpen(true);
    }

    const closeAdditionalInfo = () => {
        setIsAdditionalInfoOpen(false);
    }

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    <h3 className="mb-2">Profile</h3>
                    {isLoading 
                        ? <Spinner animation="border" className="align-self-center"/> 
                        : <FormValidation initialValues={personalData} validationSchema={ProfileSchema} onSubmit={handleEditProfile} enableReinitialize={true}>
                            { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row className={!isOwner ? 'mb-3' : 'mb-3 justify-content-between'}>
                                        <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formProfileName">
                                            <Form.Label>{t("labels.name")}</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="name"
                                                placeholder="Name" 
                                                value={values?.name}
                                                disabled={!isEdit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.name && !!errors.name}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} sm={6} md={3} controlId="formProfileEmail">
                                            <Form.Label>{t("labels.email")}</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                name="email"
                                                placeholder="name@example.com" 
                                                value={values?.email}
                                                disabled={!isEdit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched?.email && !!errors?.email}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {errors?.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        {isOwner && (<Form.Group as={Col} xs={2} controlId="formProfileLanguage" className="px-1 flex-grow-1">
                                            <Form.Label>{t("labels.language")}</Form.Label>
                                            <Form.Select
                                                value={currentLang}
                                                onChange={handleChangeLanguage}
                                            >
                                                <option value="en">{t("options.english")}</option>
                                                <option value="es">{t("options.spanish")}</option>
                                                <option value="ua">{t("options.ukrainian")}</option>
                                            </Form.Select>
                                        </Form.Group>)}
                                        {(isOwner || !readOnly) && (
                                            <Form.Group as={Col} xs={1} controlId="formEditProfile" className="d-flex flex-grow-1 align-items-center justify-content-center">
                                            <Button type="submit" className="w-100" variant={theme === "light" ? "outline-dark" : "outline-light"}>
                                                <CiEdit />
                                            </Button>
                                        </Form.Group>)}
                                        {(isOwner || !readOnly) && (<Form.Group as={Col} xs={1} controlId="formAdditionalInfoProfile" className="d-flex flex-grow-1 align-items-center justify-content-center">
                                            <Button className="w-100"
                                                variant={theme === "light" ? "outline-dark" : "outline-light"}
                                                onClick={openAdditionalInfo}
                                            >
                                                <FaRegAddressCard />
                                            </Button>
                                        </Form.Group>)}
                                        {isOwner && (<Form.Group as={Col} xs={1} controlId="formChangePassword" className="flex-grow-1 d-flex align-items-center justify-content-center">
                                            <Button variant={theme === "light" ? "outline-dark" : "outline-light"} href={link.PASSWORD_RESET} className="w-100">
                                                <MdLockReset />
                                            </Button>
                                        </Form.Group>)}
                                        {isOwner && (<Form.Group as={Col} xs={1} controlId="formProfileTheme" className="d-flex flex-grow-1 align-items-center justify-content-center">
                                            <Button className="w-100"
                                                variant={theme === "light" ? "outline-dark" : "outline-light"}
                                                onClick={handleThemeToggle}
                                            >
                                                <CiLight />
                                            </Button>
                                        </Form.Group>)}
                                    </Row>
                                </Form>
                            )}
                        </FormValidation>}
                </Col>
            </Row>
            <Row className="mb-4">
                <Col className="d-flex flex-column gap-4" >
                    { !isOwner
                        ? <></>
                        : myInventoriesLoading 
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
                    { !isOwner
                        ? <></>
                        : editableInventoriesLoading 
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
            <AdditionalInfo isOpen={isAdditionalInfoOpen} onClose={closeAdditionalInfo} userId={!isOwner ? targetUserId : null} onShowToast={onShowToast} onSupportRequest={onSupportRequest} />
        </Container>
    );
};