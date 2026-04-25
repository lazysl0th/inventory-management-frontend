import { SETTINGS } from '@/shared/config/constants'
import { BsFacebook } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

const socialButtons = [
    { icon: FcGoogle, href: SETTINGS.urls.googleUrl, size: 30 },
    {
        icon: BsFacebook,
        href: SETTINGS.urls.facebookUrl,
        size: 30,
        color: '#1877F2',
    },
]

export default socialButtons
