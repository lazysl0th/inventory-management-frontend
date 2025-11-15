import { useState, useEffect, useRef } from 'react';
import { Modal, Form, FloatingLabel, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { initialStateAdditionalInfo } from '../../utils/constants';
import FormValidation from '../FormValidator/FormValidator';
import { AdditionalInfoSchema } from '../../utils/validationSchema';
import { getAddress, addAdditionInfo, getAdditionalInfo } from '../../utils/salesForceApi';

function AdditionalInfo({
    isOpen,
    userId,
    onClose,
    onShowToast,
}) {
    const [additionalInfo, setAdditionalInfo] = useState(initialStateAdditionalInfo);
    const [isLoading, setIsLoading] = useState(false)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const { t } = useTranslation("profile");
    const { t: tv } = useTranslation("validation");
    const { t: tc } = useTranslation("common");
    const formikRef = useRef();

    useEffect(() => { 
        if (isOpen) {
            loadLocation();
            loadInfo();
        }
    }, [isOpen]);
    
    const loadLocation = async () => {
        try{
            const location = await getAddress();
            setCountries(location.countries);
            setStates(location.states);
        } catch (e) {
            console.log(e);
        }
    }

    const loadInfo = async () => {
        try{
            setIsLoading(true);
            const records = await getAdditionalInfo(userId);
            if(records.length > 0) {
                const {attributes, ...info} = records[0];
                setAdditionalInfo(info)
            }
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        onClose();
        setAdditionalInfo(initialStateAdditionalInfo);
    }

    const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function isBitSet(validFor, index) {
        if (!validFor) return false;
        const charIndex = Math.floor(index / 6);
        if (charIndex >= validFor.length) return false;
        const bits = BASE64_CHARS.indexOf(validFor[charIndex]);
        if (bits === -1) return false;
        const bitIndex = index % 6;
        return ((bits >> (5 - bitIndex)) & 1) === 1;
    }

    function getStatesForCountry(countryCode) {
        const index = countries.findIndex(c => c.value === countryCode);
        if (index === -1) return [];
        return states.filter(state => state.validFor && isBitSet(state.validFor, index));
    }

    const handleAddAdditionalInfo = async (values) => {
        const { accountId, contactId } = await addAdditionInfo(values, userId);
        if (accountId && contactId) onShowToast(t("toasts.updateUserSucces"), 'bottom-center');
        else onShowToast(t("toasts.updateUserFailed"), 'bottom-center');
    }

    return (
        <Modal
            show={isOpen}
            onHide={handleClose}
            size="md"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t("title.additionalInfo")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormValidation innerRef={formikRef} initialValues={additionalInfo} validationSchema={AdditionalInfoSchema} onSubmit={handleAddAdditionalInfo}>
                    { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => {
                        const filteredStates = getStatesForCountry(values.ShippingCountryCode);
                        return (
                            <Form
                                noValidate
                                className='d-flex flex-column align-self-center' 
                                name='additionalInfo'
                                onSubmit={handleSubmit}
                            >
                                <Form.Group className="mb-3" controlId="formGroup">
                                    <FloatingLabel
                                        controlId="floatingInputPhone"
                                        label={t("labels.phone")}
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            type="tel" 
                                            name="Phone"
                                            placeholder={t("placeholders.phone")} 
                                            value={values?.Phone ?? ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.Phone && !!errors.Phone}
                                            isValid={touched.Phone && !errors.Phone}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {tv(`${errors.Phone}`)}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                    <Form.Label>{t("labels.shippingAddress.shippingAddress")}</Form.Label>
                                    <Form.Group controlId='formGroupShippingAddress' >
                                        <FloatingLabel className='mb-3' controlId='floatingLabelShippingCountry' label={t("labels.shippingAddress.country")}>
                                            <Form.Select
                                                value={values?.ShippingCountryCode}
                                                onChange={handleChange}
                                                name='ShippingCountryCode'
                                                onBlur={handleBlur}
                                                placeholder={t("placeholders.country")} 
                                                isInvalid={touched.ShippingCountryCode && !!errors.ShippingCountryCode}
                                                isValid={touched.ShippingCountryCode && !errors.ShippingCountryCode}
                                            >
                                                {isLoading
                                                    ? <option value="" disabled>{t("options.loading")}</option>
                                                    : <>
                                                        <option value="" disabled>{t("options.country")}</option>
                                                        {countries?.map((country) => (<option key={country.value} value={country.value}>{tc(`countries.${country.label}`)}</option>))}
                                                    </>}
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>
                                                {tv(`${errors.ShippingCountryCode}`)}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <FloatingLabel className='mb-3' controlId='floatingLabelShippingState' label={t("labels.shippingAddress.state")}>
                                            <Form.Select
                                                value={values?.ShippingStateCode}
                                                onChange={handleChange}
                                                name='ShippingStateCode'
                                                onBlur={handleBlur}
                                                placeholder={t("placeholders.state")} 
                                                isInvalid={touched.ShippingStateCode && !!errors.ShippingStateCode}
                                                isValid={touched.ShippingStateCode && !errors.ShippingStateCode}
                                            >
                                                {isLoading
                                                    ? <option value="" disabled>{t("options.loading")}</option>
                                                    : <>
                                                        <option value="" disabled>{t("options.state")}</option>
                                                        {filteredStates?.map((state) => (<option key={state.label} value={state.value}>{tc(`states.${state.label}`)}</option>))}
                                                    </>}
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>
                                                {tv(`${errors.ShippingStateCode}`)}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <FloatingLabel className='mb-3' controlId='floatingLabelShippingCity' label={t("labels.shippingAddress.city")}>
                                            <Form.Control 
                                                type="text"
                                                name='ShippingCity'
                                                placeholder={t("placeholders.city")} 
                                                value={values?.ShippingCity ?? ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.ShippingCity && !!errors.ShippingCity}
                                                isValid={touched.ShippingCity && !errors.ShippingCity}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {tv(`${errors.ShippingCity}`)}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <FloatingLabel className='mb-3' controlId='floatingLabelShippingStreet' label={t("labels.shippingAddress.street")}>
                                            <Form.Control
                                                type="text"
                                                name='ShippingStreet'
                                                placeholder={t("placeholders.street")} 
                                                value={values?.ShippingStreet ?? ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.ShippingStreet && !!errors.ShippingStreet}
                                                isValid={touched.ShippingStreet && !errors.ShippingStreet}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {tv(`${errors.ShippingStreet}`)}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                        <FloatingLabel className='mb-3' controlId='floatingLabelPostalCode' label={t("labels.shippingAddress.postalCode")}>
                                            <Form.Control
                                                type="text"
                                                name='ShippingPostalCode'
                                                placeholder={t("placeholders.postalCode")} 
                                                value={values?.ShippingPostalCode ?? ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.ShippingPostalCode && !!errors.ShippingPostalCode}
                                                isValid={touched.ShippingPostalCode && !errors.ShippingPostalCode}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {tv(`${errors.ShippingPostalCode}`)}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Form.Group>
                                <Button type='submit' variant='dark' disabled={isSubmitting}>
                                    {isSubmitting ? t("buttons.addAditionalInfo")+"..." : t("buttons.addAditionalInfo")}
                                </Button>
                            </Form>
                    )}}
                </FormValidation>
            </Modal.Body>
        </Modal>
    );
}

export default AdditionalInfo;