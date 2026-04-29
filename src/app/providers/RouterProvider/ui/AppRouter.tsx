import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useGetUserProfileQuery } from '@/entities/user/api/profileApi'
import { Loader } from '@/shared/ui/Loader'
import { MainPage } from '@/pages/MainPage'
import { ADMIN, AUTH_SUCCESS, CHANGE_PASSWORD, INVENTORIES, ITEMS, LOGIN, PRIVACY, PROFILE, REGISTER, RESET_PASSWORD, SEARCH, USER_DATA_DELETE, USERS } from '@/shared/config/constants'
import RootLayout from '@/app/layout/RootLayout'

const AuthLayout = lazy(() => import('@/app/layout/AuthLayout'))
const FullPageLayout = lazy(() => import('@/app/layout/FullPageLayout'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(module => ({ default: module.SearchPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then(module => ({ default: module.AdminPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(module => ({ default: module.RegisterPage })))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })))
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage').then(module => ({ default: module.ChangePasswordPage })))
const OAuthSuccessPage = lazy(() => import('@/pages/OAuthSuccessPage').then(module => ({ default: module.OAuthSuccessPage })))
const DeleteUserDataPage = lazy(() => import('@/pages/DeleteUserDataPage').then(module => ({ default: module.DeleteUserDataPage })))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))
const InventoryPage = lazy(() => import('@/pages/InventoryPage').then(module => ({ default: module.InventoryPage })))
const InventoryTabsPage = lazy(() => import('@/pages/InventoryTabsPage').then(module => ({ default: module.InventoryTabsPage })))
const ItemPage = lazy(() => import('@/pages/ItemPage').then(module => ({ default: module.ItemPage })))
const InventoryModalPage = lazy(() => import('@/pages/InventoryModalPage').then(module => ({ default: module.InventoryModalPage })))
const ItemModalPage = lazy(() => import('@/pages/ItemModalPage').then(module => ({ default: module.ItemModalPage })))

const AppRouter = () => {
    useGetUserProfileQuery()
    const location = useLocation()
    const backgroundLocation = location.state?.backgroundLocation
    return (
        <>
            <Routes location={backgroundLocation || location}>
                <Route element={<Suspense fallback={<Loader />}><RootLayout /></Suspense>}>
                    <Route index element={<MainPage />} />
                    <Route
                        path={SEARCH}
                        element={<SearchPage />}
                    />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path={PROFILE}
                            element={<ProfilePage />}
                        />
                        <Route
                            path={ADMIN}
                            element={<AdminPage />}
                        />
                    </Route>
                    <Route
                        path={`${USERS}/:userId`}
                        element={<ProfilePage />}
                    />
                    <Route path={INVENTORIES}>
                        <Route
                            path='new/:activeTab?'
                            element={<InventoryPage />}
                        />
                        <Route path=':inventoryId' element={<InventoryPage />}>
                            <Route
                                path=':activeTab?'
                                element={<InventoryTabsPage />}
                            />
                        </Route>
                    </Route>
                    <Route
                        path={`${INVENTORIES}/:inventoryId/${ITEMS}/new`}
                        element={<ItemPage />}
                    />
                    <Route
                        path={`${INVENTORIES}/:inventoryId/${ITEMS}/:itemId`}
                        element={<ItemPage />}
                    />
                </Route>
                <Route element={<Suspense fallback={<Loader className='min-vh-100'/>}><AuthLayout /></Suspense>}>
                    <Route
                        path={LOGIN}
                        element={<LoginPage />}
                    />
                    <Route
                        path={REGISTER}
                        element={<RegisterPage />}
                    />
                    <Route
                        path={RESET_PASSWORD}
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path={CHANGE_PASSWORD}
                        element={<ChangePasswordPage />}
                    />
                </Route>
                <Route
                    path={AUTH_SUCCESS}
                    element={<Suspense fallback={<Loader className='min-vh-100'/>}><OAuthSuccessPage /></Suspense>}
                />
                <Route element={<Suspense fallback={<Loader className='min-vh-100'/>}><FullPageLayout/></Suspense>}>
                    <Route
                        path={USER_DATA_DELETE}
                        element={<DeleteUserDataPage />}
                    />
                    <Route
                        path={PRIVACY}
                        element={<PrivacyPage />}
                    />
                    <Route path='*' element={<NotFoundPage />} />
                </Route>
            </Routes>
            {backgroundLocation && (
                <Routes>
                    <Route
                        path={`${INVENTORIES}`}
                        element={<Suspense fallback={<Loader className='min-vh-100'/>}><InventoryModalPage /></Suspense>}
                    >
                        <Route path='new' element={<InventoryPage />}>
                            <Route
                                path=':activeTab?'
                                element={<InventoryTabsPage />}
                            />
                        </Route>
                        <Route path=':inventoryId' element={<InventoryPage />}>
                            <Route
                                path=':activeTab?'
                                element={<InventoryTabsPage />}
                            >
                                <Route
                                    path={`${ITEMS}/:itemId`}
                                    element={<ItemModalPage />}
                                />
                                <Route
                                    path={`${ITEMS}/new`}
                                    element={<ItemModalPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            )}
        </>
    )
}

export default AppRouter
