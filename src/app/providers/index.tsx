import { ReactNode } from 'react'
import StoreProvider from './StoreProvider'
import { I18nProvider } from './I18nProvider'
import { RouterProvider } from './RouterProvider'

interface Props {
    children: ReactNode
}

export const AppProviders = ({ children }: Props) => {
    return (
        <StoreProvider>
            <I18nProvider>
                <RouterProvider>{children}</RouterProvider>
            </I18nProvider>
        </StoreProvider>
    )
}
