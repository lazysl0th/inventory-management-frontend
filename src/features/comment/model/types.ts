import type { IUser } from '@/entities/user/model/types'
import type { FormikConfig } from 'formik'

export interface IComment {
    id: number
    user: IUser
    createdAt: Date
    inventoryId?: number
    content: string
    userId: number
}

export interface ISelectParam {
    inventoryId: string
}

export interface ICommentData extends ISelectParam {
    content: string
}

export interface ICommentProps {
    comment: IComment
}

export interface ICommentForm {
    content: string
}

export type TSubmitHandler = FormikConfig<ICommentForm>['onSubmit']
