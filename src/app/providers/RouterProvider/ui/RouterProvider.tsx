import { BrowserRouter } from 'react-router-dom'

const RouterProvider = ({ children }: { children: React.ReactNode }) => {
    return <BrowserRouter>{children}</BrowserRouter>
}

export default RouterProvider
