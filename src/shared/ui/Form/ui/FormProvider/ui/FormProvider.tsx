import { FormikProvider, useFormik } from 'formik'
import { Form } from 'react-bootstrap'
import { IFormProps } from '../model/types'

export default function FormProvider<T extends object>({
    config,
    children,
    ...rest
}: IFormProps<T>) {
    const formik = useFormik<T>(config)

    return (
        <FormikProvider value={formik}>
            <Form
                {...rest}
                noValidate
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                {children}
            </Form>
        </FormikProvider>
    )
}
