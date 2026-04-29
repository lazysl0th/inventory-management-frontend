import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from '@/shared/config/constants'
import { BsFacebook } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

const socialButtons = [
    { icon: FcGoogle, href: GOOGLE_AUTH_URL, size: 30 },
    {
        icon: BsFacebook,
        href: FACEBOOK_AUTH_URL,
        size: 30,
        color: '#1877F2',
    },
]

export default socialButtons
