import { Formik } from "formik";

export default function FormValidation ({ initialValues, validationSchema, onSubmit, children, validateOnMount, innerRef }) {

    const submitHandler = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            innerRef={innerRef}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
            validateOnMount={validateOnMount}
            enableReinitialize
        >
            {(formikProps) => {
                const { setFieldValue } = formikProps;
                const handleChangeCheckbox = (e) => {
                    const { name, checked } = e.target;
                    setFieldValue(name, checked);
                };
                    return (<>
                        { children({ ...formikProps, handleChangeCheckbox}) }
                    </>)
            }}
        </Formik>
    );
}