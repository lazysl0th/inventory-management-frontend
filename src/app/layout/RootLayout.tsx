import { Outlet } from 'react-router-dom'
import Header from '../../widgets/Header/ui/Header'

const RootLayout: React.FC = () => (
    <>
        <Header />
        <Outlet />
    </>
)

export default RootLayout
