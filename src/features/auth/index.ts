import { lazy } from 'react'
export const LoginForm = lazy(() => import('./ui/LoginForm'))
export const RegisterForm = lazy(() => import('./ui/RegisterForm'))
export const ResetPasswordForm = lazy(() => import('./ui/ResetPasswordForm'))
export const ChangePasswordForm = lazy(() => import('./ui/ChangePasswordForm'))
export const SocialButtons = lazy(() => import('./ui/SocialButtons'))
export {
    default as authSliceReducer,
    getIsAuthenticated,
    getIsAuthChecked,
} from './model/authSlice'
export {
    useLoginByEmailMutation,
    useLogoutMutation,
    useRegisterMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} from './api/authApi'
