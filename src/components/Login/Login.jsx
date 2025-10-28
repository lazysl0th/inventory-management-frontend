import { useState } from 'react';
import { Container, Row, Col, Form, Button, Image, Navbar, FloatingLabel, InputGroup} from 'react-bootstrap';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { BiArrowBack } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import FormValidation from '../FormValidator/FormValidator';
import { SigninSchema } from '../../utils/validationSchema';
import { link } from '../../utils/constants'

export default function Register ({ onAuth }) {
    const [showPassword, setShowPassword] = useState(false);
    const [initialValues, setIinitialValues] = useState({ email: '', password: '', remember: false })

    const onShowPass = () => setShowPassword(prev => !prev);
    
    return (
        <Container fluid className="min-vh-100 align-content-center">
            <Row className="text-center py-5">
                <Col xs={6} md={3}>
                    <span>
                        <a className='fw-normal text-decoration-underline text-dark' href='/'>
                            <BiArrowBack/>{' '}Back
                        </a>
                    </span>
                </Col>
            </Row>
            <Row className='justify-content-start'>
                <Col xs={12} md={6} className='d-flex flex-column'>
                    <FormValidation initialValues={initialValues} validationSchema={SigninSchema} onSubmit={onAuth}>
                        { ({ handleSubmit, values, handleChange, handleChangeCheckbox, handleBlur, touched, errors, isSubmitting}) => (
                            <Form
                                noValidate
                                className='d-flex flex-column align-self-center' 
                                name='login'
                                onSubmit={handleSubmit}
                            >                                
                                <p className='text-start mb-0'>Start your journey</p>
                                <h2 className='text-start mb-5'>Sign In to The App</h2>

                                
                                <Form.Group className="mb-3" controlId="formGroup">
                                    <FloatingLabel
                                        controlId="floatingInputEmail"
                                        label="Email"
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
                                            {errors.email}
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
                                    <Form.Check 
                                        className='align-self-start mb-3'
                                        type='checkbox'
                                        checked={values.remember}
                                        name='remember'
                                        id='remember-input'
                                        label='Remember me'
                                        onChange={handleChangeCheckbox}/>
                                </Form.Group>
                                <Button type='submit' variant='dark' disabled={isSubmitting}>
                                    {isSubmitting ? "Signing In..." : "Sign In"}
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
                        Don't have an account?{' '}
                        <a className='fw-normal text-decoration-underline text-dark' href={link.SIGNUP}>
                            Sign{'\u00A0'}up
                        </a>
                    </span>
                </Col>
                <Col xs={6} md={3}>
                    <a href={link.PASSWORD_RESET} className='text-decoration-underline text-dark fw-normal'>
                        Forgot password?
                    </a>
                </Col>
            </Row>
        </Container>
    );
}