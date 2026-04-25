import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyGetUserProfileQuery } from '@/entities/user'
import { SETTINGS } from '@/shared/config/constants'

const OAuthSuccessPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [getUserProfile] = useLazyGetUserProfileQuery()

    useEffect(() => {
        const authenticate = async () => {
            const token = searchParams.get('authToken')
            if (!token) {
                navigate(SETTINGS.routes.login, { replace: true })
                return
            }
            try {
                await getUserProfile().unwrap()
                navigate(SETTINGS.routes.profile, { replace: true })
            } catch (e) {
                console.log(e)
                navigate(SETTINGS.routes.login, { replace: true })
            }
        }
        authenticate()
    }, [dispatch, getUserProfile, navigate, searchParams])

    return null
}

export default OAuthSuccessPage
