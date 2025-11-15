import { useState } from 'react';
import { Container, Row, Col, Form, Button, Navbar, FloatingLabel } from 'react-bootstrap';
import FormValidation from '../FormValidator/FormValidator';
import { ResetPasswordSchema } from '../../utils/validationSchema';
import { useTranslation } from 'react-i18next';
import { link } from '../../utils/constants';




export default function ResetPassword({ handlerResetPassword }) {
    const [email, setEmail] = useState({ email: '' });
    const { t } = useTranslation("auth");
    const { t: tv } = useTranslation("validation");

    return (
        <Container>
            <Row className=''>
                <Col xs={6} className='py-1 min-w-320px d-flex flex-column vh-100 column-background'>
                <FormValidation initialValues={email} validationSchema={ResetPasswordSchema} onSubmit={handlerResetPassword}>
                    { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                        <Form 
                            noValidate
                            className='flex-grow-1 py-5 d-flex flex-column justify-content-center align-self-center w-296px'
                            name='resetPass'
                            onSubmit={handleSubmit}>
                            <h2 className='text-start mb-5'>{t("text.resetPassword")}</h2>
                                <FloatingLabel
                                    controlId="floatingInputEmail"
                                    label={t("placeholders.email")}
                                    className="mb-3"
                                >
                                    <Form.Control 
                                        type="email" 
                                        name="email"
                                        placeholder="name@example.com" 
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.email && !!errors.email}
                                        isValid={touched.email && !errors.email}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {tv(`${errors.email}`)}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            <Button type='submit' variant='dark'>
                                {isSubmitting ? t("buttons.resetPassword")+"..." : t("buttons.resetPassword")}
                            </Button>
                        </Form>
                    )}
                </FormValidation>
                    <Navbar className="py-3 bg-body-ligth">
                    <Container>
                        <Navbar.Collapse className="justify-content-start">
                        <Navbar.Text className='text-dark'>
                           {t("text.existAccount")}{" "}
                           <a className='fw-normal text-decoration-underline text-dark' href={link.SIGNIN}>
                                {t("links.signin")}
                            </a>
                        </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    );
}