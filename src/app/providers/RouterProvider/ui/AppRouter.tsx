import RootLayout from '@/app/layout/RootLayout'
import { SETTINGS } from '@/shared/config/constants'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { InventoryPage } from '@/pages/InventoryPage'
import { InventoryTabsPage } from '@/pages/InventoryTabsPage'
import AuthLayout from '@/app/layout/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { ChangePasswordPage } from '@/pages/ChangePasswordPage'
import { useGetUserProfileQuery } from '@/entities/user'
import { InventoryModalPage } from '@/pages/InventoryModalPage'
import { ItemModalPage } from '@/pages/ItemModalPage'
import { ItemPage } from '@/pages/ItemPage'
import { AdminPage } from '@/pages/AdminPage'
import { DeleteUserDataPage } from '@/pages/DeleteUserDataPage'
import { MainPage } from '@/pages/MainPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OAuthSuccessPage } from '@/pages/OAuthSuccessPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { SearchPage } from '@/pages/SearchPage'
import { ProfilePage } from '@/pages/ProfilePage'

const AppRouter = () => {
    useGetUserProfileQuery()
    const location = useLocation()
    const backgroundLocation = location.state?.backgroundLocation
    return (
        <>
            <Routes location={backgroundLocation || location}>
                <Route element={<RootLayout />}>
                    <Route index element={<MainPage />} />
                    <Route
                        path={SETTINGS.routes.search}
                        element={<SearchPage />}
                    />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path={SETTINGS.routes.profile}
                            element={<ProfilePage />}
                        />
                        <Route
                            path={SETTINGS.routes.admin}
                            element={<AdminPage />}
                        />
                    </Route>
                    <Route
                        path={`${SETTINGS.routes.users}/:userId`}
                        element={<ProfilePage />}
                    />
                    <Route path={SETTINGS.routes.inventories}>
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
                        path={`${SETTINGS.routes.inventories}/:inventoryId/${SETTINGS.routes.items}/new`}
                        element={<ItemPage />}
                    />
                    <Route
                        path={`${SETTINGS.routes.inventories}/:inventoryId/${SETTINGS.routes.items}/:itemId`}
                        element={<ItemPage />}
                    />
                </Route>
                <Route element={<AuthLayout />}>
                    <Route
                        path={SETTINGS.routes.login}
                        element={<LoginPage />}
                    />
                    <Route
                        path={SETTINGS.routes.register}
                        element={<RegisterPage />}
                    />
                    <Route
                        path={SETTINGS.routes.resetPassword}
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path={SETTINGS.routes.changePassword}
                        element={<ChangePasswordPage />}
                    />
                </Route>
                <Route
                    path={SETTINGS.routes.authSuccess}
                    element={<OAuthSuccessPage />}
                />
                <Route
                    path={SETTINGS.routes.deleteUserData}
                    element={<DeleteUserDataPage />}
                />
                <Route
                    path={SETTINGS.routes.privacy}
                    element={<PrivacyPage />}
                />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
            {backgroundLocation && (
                <Routes>
                    <Route
                        path={`${SETTINGS.routes.inventories}`}
                        element={<InventoryModalPage />}
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
                                    path={`${SETTINGS.routes.items}/:itemId`}
                                    element={<ItemModalPage />}
                                />
                                <Route
                                    path={`${SETTINGS.routes.items}/new`}
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
