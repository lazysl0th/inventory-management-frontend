import { FormikConfig } from 'formik'

export interface IProfileForm {
    name: string
    email: string
    language: string
    theme: string
}

export type TSubmitHandler = FormikConfig<IProfileForm>['onSubmit']
