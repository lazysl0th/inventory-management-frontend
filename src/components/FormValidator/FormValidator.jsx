import { Formik } from "formik";

export default function FormValidation ({ initialValues, validationSchema, onSubmit, children,}) {

    function submitHandler(values, { setSubmitting, resetForm}) {
        try {
            setSubmitting(true);
            onSubmit(values);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit = {submitHandler}
        >
            {(formikProps) => (
                    <>
                        { children({ ...formikProps }) }
                    </>
            )}
        </Formik>
    );
}