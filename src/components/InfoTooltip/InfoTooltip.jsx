import { Modal, ListGroup, Button, ModalBody, ModalFooter, Form, FloatingLabel, CloseButton} from "react-bootstrap";
import { useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GrUpdate } from "react-icons/gr";
import { MdSaveAlt } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import FormValidation from "../FormValidator/FormValidator";
import { initialStateSupportRequeste } from '../../utils/constants';
import { SupportRequesShema } from '../../utils/validationSchema';
import { GET_INVENTORY_INFO } from '../../graphql/inventoryQueries';
import { sendSupportRequest } from '../../utils/supportApi';

export default function InfoTooltip({ isOpen, onClose, title, onReload, onForceSave, message, inventoryId, onShowToast, onSupportRequest }) {
    const { t } = useTranslation("common");
    const { t: ta } = useTranslation("auth");
    const { t: tv } = useTranslation("validation");
    const [supportRequest, setSupportRequest] = useState(initialStateSupportRequeste)

    const currentUser = useContext(CurrentUserContext);
    const [loadInventory, { data: dataInventory, loading: loadingInventory}] = useLazyQuery(GET_INVENTORY_INFO);
    const inventoryTitle = dataInventory?.inventory?.title || ''

    const updateStateSupportRequest = (supportRequestData) => {
        const updated = { ...supportRequest };
        for (let key in supportRequestData) {
            updated[key] = supportRequestData[key];
        }
        setSupportRequest(updated);
    };

    useEffect(() => {
        if (isOpen && message == 'Help') {
            if (inventoryId) loadInventory({ variables: { id: inventoryId } });
            updateStateSupportRequest({
                userName: currentUser.name ? currentUser.name : '',
                userEmail: currentUser.email ? currentUser.email : '',
                link: window.location.href,
                inventory: inventoryTitle ? inventoryTitle : ''
            })
        }
    },[isOpen, message, inventoryId, dataInventory])
 
    const handleSendSupportRequest = async (values) => {
        const request = await sendSupportRequest(values);
        if (request.success) {
            onShowToast('Your support request has been successfully sent', 'bottom-center');
            setSupportRequest(initialStateSupportRequeste);
            onClose()
        } else {
            onShowToast('There were errors while submitting your support request.', 'bottom-center');
            console.log(request);
        }
    }



    return (
        <Modal
            size="md"
            show={isOpen}
            centered
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <Modal.Header>
                <Modal.Title id="example-modal-sizes-title-sm">
                    {title}
                </Modal.Title>
                {message !== 'Help' && (<Button variant="secondary" className="p-0 ms-auto bg-transparent border-0" onClick={onSupportRequest}>
                    <IoIosHelpCircleOutline size={24} className="text-secondary btn-help"/>
                </Button>)}
                <CloseButton className={message !== 'Help' ? 'ms-0' : "ms-auto"} onClick={onClose}/>
            </Modal.Header>
            {message === 'Version conflict'
                ? (<>
                    <Modal.Body>
                        <p className="mb-2">{t("versionConflict.paragraph")}</p>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>{t("versionConflict.listItems.update")}</strong> — {t("versionConflict.listItems.textUpdate")}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>{t("versionConflict.listItems.rewrite")}</strong> — {t("versionConflict.listItems.textRewrite")}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onReload}>
                            <GrUpdate /> {t("versionConflict.buttons.update")}
                        </Button>
                        <Button variant="danger" onClick={onForceSave}>
                            <MdSaveAlt /> {t("versionConflict.buttons.rewrite")}
                        </Button>
                    </Modal.Footer>
                </>)
                : message === 'Help'
                    ? <>
                        <ModalBody>
                            <FormValidation initialValues={supportRequest} validationSchema={SupportRequesShema} onSubmit={handleSendSupportRequest}>
                                { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                                    <Form
                                        noValidate
                                        className='d-flex flex-column align-self-center' 
                                        name='support'
                                        onSubmit={handleSubmit}
                                    >
                                        <Form.Group className="mb-3" controlId="formGroup">
                                            <FloatingLabel
                                                controlId="floatingInputName"
                                                label={ta("placeholders.name")}
                                                className="mb-3"
                                            >
                                                <Form.Control 
                                                    type="text" 
                                                    name="userName"
                                                    placeholder={ta("placeholders.name")} 
                                                    value={values.userName }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.userName && !!errors.userName}
                                                    isValid={touched.userName && !errors.userName}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {tv(`${errors.userName}`)}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId="floatingInputEmail"
                                                label={ta("placeholders.email")}
                                                className="mb-3"
                                            >
                                                <Form.Control 
                                                    type="email" 
                                                    name="userEmail"
                                                    placeholder="name@example.com" 
                                                    value={values.userEmail}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched?.userEmail && !!errors?.userEmail}
                                                    isValid={touched?.userEmail && !errors?.userEmail}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {tv(`${errors.userEmail}`)}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId="floatingInputInventory"
                                                label="Title inventory"
                                                className="mb-3"
                                            >
                                                <Form.Control 
                                                    type="text" 
                                                    name="inventory"
                                                    placeholder="Title Inventory" 
                                                    value={values.inventory}
                                                    disabled
                                                />
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId="floatingInputlink"
                                                label="Link"
                                                className="mb-3"
                                            >
                                                <Form.Control 
                                                    type="text" 
                                                    name="link"
                                                    placeholder="Link" 
                                                    value={values.link}
                                                    disabled
                                                />
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId="floatingInputPriority"
                                                label="Priority"
                                                className="mb-3"
                                            >
                                                <Form.Select
                                                    value={values.priority}
                                                    name="priority"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    isInvalid={touched?.priority && !!errors?.priority}
                                                    isValid={touched?.priority && !errors?.priority}
                                                >
                                                    <option value="" disabled>{'Select priority...'}</option>
                                                    <option value="high">High</option>
                                                    <option value="average">Average</option>
                                                    <option value="low">Low</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors?.priority}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel controlId='floatingLabelRequest' label='Request'>
                                                <Form.Control
                                                    as="textarea"
                                                    name='request'
                                                    placeholder='request'
                                                    rows={4}
                                                    value={values.request ?? ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched?.request && !!errors?.request}
                                                    isValid={touched?.request && !errors?.request}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors?.request}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                        <Button type='submit' variant='dark' disabled={isSubmitting}>
                                            {isSubmitting ? "Send request"+"..." : "Send request"}
                                        </Button>
                                    </Form>
                                )}
                            </FormValidation>
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                    : <Modal.Body>{message}</Modal.Body>
            }
        </Modal>
    );
}