import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, FloatingLabel} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import FormValidation from '../FormValidator/FormValidator';
import { ChangePasswordSchema } from '../../utils/validationSchema';

export default function ChangePassword ({ handlerChangePassword }) {
    const [password, setpassword] = useState({ password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { t } = useTranslation("auth");
    

    return (
        <Container>
            <Row className=''>
                <Col xs={6} className='py-1 min-w-320px d-flex flex-column vh-100 column-background'>
                    <FormValidation initialValues={{ ...password, token}} validationSchema={ChangePasswordSchema} onSubmit={handlerChangePassword}>
                    { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                        <Form
                            noValidate
                            className='flex-grow-1 py-5 d-flex flex-column justify-content-center align-self-center w-296px'
                            name='changePass'
                            onSubmit={handleSubmit}>
                            <h2 className='text-start mb-5'>{t("text.changePassword")}</h2>
                            <Form.Group className="mb-3" controlId="formGroupPassword" style={{ position: 'relative' }} >
                                <FloatingLabel controlId='floatingLabelPassword' label={t("placeholders.password")}>
                                    <Form.Control 
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        placeholder='Password'
                                        value={values?.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.password && !!errors.password}
                                        isValid={touched.password && !errors.password}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    style={{
                                    position: 'absolute',
                                    top: '1.15rem',
                                    right: '0.7rem',
                                    padding: 0,
                                    fontSize: '0.85rem',
                                    userSelect: 'none',
                                    background: 'white',
                                    border: 'none',
                                    boxShadow: 'none',
                                    color: '#6c757d',
                                    cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </Button>
                            </Form.Group>
                            <Button type='submit' variant='dark'> {isSubmitting ? t("buttons.changePassword")+"..." : t("buttons.changePassword")}</Button>
                        </Form>
                        )}
                    </FormValidation>
                </Col>
            </Row>
        </Container>
    );
}