import { IUser } from '@/entities/user/model/types'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export interface IUserData {
    name: string
    email: string
}

export interface IAccessToken {
    accessToken: string
}

export interface IAuthResponce extends IAccessToken {
    user: IUser
}

export interface IRegData extends IUserData {
    password: string
}

export interface IEmailAuthData extends Omit<IRegData, 'name'> {
    remember: boolean
}
export type TProvider = 'googleId' | 'facebookId'

export interface ISocialAuthData extends IUserData {
    provider: TProvider
    socialId: string
}

export interface IAuthState {
    isAuthChecked: boolean
    isAuthenticated: boolean
    loginUserError: FetchBaseQueryError | null
    loginUserRequest: boolean
}

export interface IChangePasswordForm {
    password: string
}

export interface IResetPasswordForm {
    email: string
}

export interface IRegisterForm {
    name: string
    email: string
    password: string
}

export interface ILoginForm {
    email: string
    password: string
    remember: boolean
}
