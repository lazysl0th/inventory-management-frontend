import { Formik } from "formik";

export default function FormValidation ({ initialValues, validationSchema, onSubmit, children, validateOnMount, innerRef}) {

    function submitHandler(values, { setSubmitting }) {
        try {
            setSubmitting(true);
            onSubmit(values);
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
        >
            {(formikProps) => (
                    <>
                        { children({ ...formikProps }) }
                    </>
            )}
        </Formik>
    );
}