import { useState } from "react";
import { Container, Row, Col, Form, FloatingLabel, Button} from 'react-bootstrap';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import * as Yup from "yup";
import FormValidation from "../FormValidator/FormValidator";
import { link } from '../../utils/constants'
import './Register.css';

export default function Register ({ onReg }) {
    const [showPassword, setShowPassword] = useState(false);
    const [initialValues, setIinitialValues] = useState({ name: '', email: '', password: '' })

    const onShowPass = () => setShowPassword(prev => !prev);

    const SignupSchema = Yup.object({
        name: Yup.string().required("Enter name"),
        email: Yup.string().email("Please enter a valid email address").required("Enter email"),
        password: Yup.string().min(1, "Password must be at least 1 characters long").required("Enter password"),
    });
    
    return (
        <Container fluid className="min-vh-100 align-content-center">
            <Row className='justify-content-start'>
                <Col xs={12} md={6} className='d-flex flex-column'>
                    <FormValidation initialValues={initialValues} validationSchema={SignupSchema} onSubmit={onReg}>
                        { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                            <Form
                                noValidate
                                className='d-flex flex-column align-self-center' 
                                name='register'
                                onSubmit={handleSubmit}
                            >
                                <p className='text-start mb-0'>Start your journey</p>
                                <h2 className='text-start mb-5'>Sign Up to The App</h2>
                                <Form.Group className="mb-3" controlId="formGroup">
                                    <FloatingLabel
                                        controlId="floatingInputName"
                                        label="Name"
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            type="text" 
                                            name="name"
                                            placeholder="Name" 
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.name && !!errors.name}
                                            isValid={touched.name && !errors.name}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                    <FloatingLabel
                                        controlId="floatingInputEmail"
                                        label="Email"
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            type="email" 
                                            name="email"
                                            placeholder="name@example.com" 
                                            value={values.email }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched?.email && !!errors?.email}
                                            isValid={touched?.email && !errors?.email}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors?.email}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                    <Form.Group className='mb-3 position-relative' controlId='formGroupPassword' >
                                        <FloatingLabel controlId='floatingLabelPassword' label='Password'>
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
                                            variant=''
                                            className='button-show-password shadow-none'
                                            onClick={onShowPass}
                                        >
                                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </Button>
                                    </Form.Group>
                                </Form.Group>
                                <Button type='submit' variant='primary' disabled={isSubmitting}>
                                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                                </Button>
                            </Form>
                        )}
                    </FormValidation>
                </Col>
            </Row>
            <Row className="py-2">
                <Col xs={6} md={3}>
                    <Button
                        as="a"
                        href={link.GOOGLE}
                        target="_self"
                        rel="noopener noreferrer"
                        variant=""
                        className="d-flex align-items-center justify-content-end p-2 border-0 rounded-circle"
                    >
                        <FcGoogle size={30} />
                    </Button>
                </Col>
                <Col xs={6} md={3}>
                    <Button
                        as="a"
                        href={link.FACEBOOK}
                        target="_self"
                        rel="noopener noreferrer"
                        variant=""
                        className="d-flex align-items-center justify-content-start p-2 border-0 rounded-circle"
                    >
                    <BsFacebook size={30} color="#1877F2" />
                    </Button>
                </Col>
            </Row>
            <Row className="text-center py-5">
                <Col xs={6} md={3}>
                    <span>
                        Account already exist?{' '}
                        <a href={link.SINGIN} className='text-decoration-underline text-primary fw-normal'>
                        Sign{'\u00A0'}in
                        </a>
                    </span>
                </Col>

                <Col xs={6} md={3}>
                    <a href={link.PASSWORD_RESET} className='text-decoration-underline text-primary fw-normal'>
                        Forgot password?
                    </a>
                </Col>
            </Row>
        </Container>
    );
}