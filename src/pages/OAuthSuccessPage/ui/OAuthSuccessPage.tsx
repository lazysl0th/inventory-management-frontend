import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyGetUserProfileQuery } from '@/entities/user'
import { LOGIN, PROFILE } from '@/shared/config/constants'

const OAuthSuccessPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [getUserProfile] = useLazyGetUserProfileQuery()

    useEffect(() => {
        const authenticate = async () => {
            const token = searchParams.get('authToken')
            if (!token) {
                navigate(LOGIN, { replace: true })
                return
            }
            try {
                await getUserProfile().unwrap()
                navigate(PROFILE, { replace: true })
            } catch (e) {
                console.log(e)
                navigate(LOGIN, { replace: true })
            }
        }
        authenticate()
    }, [dispatch, getUserProfile, navigate, searchParams])

    return null
}

export default OAuthSuccessPage
