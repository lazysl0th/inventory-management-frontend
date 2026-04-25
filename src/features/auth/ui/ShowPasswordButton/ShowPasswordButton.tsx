import {
    forwardRef,
    ForwardRefRenderFunction,
    useEffect,
    useState,
} from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import './ShowPasswordButton.scss'
import { Button } from '@/shared/ui/Button'

const ShowPasswordButton: ForwardRefRenderFunction<HTMLInputElement, {}> = (
    _,
    ref
) => {
    const [showPassword, setShowPassword] = useState(false)
    const showPasswordHandle = (): void => setShowPassword((prev) => !prev)

    useEffect(() => {
        if (ref && typeof ref !== 'function' && ref.current) {
            ref.current.type = showPassword ? 'text' : 'password'
        }
    }, [showPassword, ref])

    return (
        <Button
            variant=''
            className='show-password-button shadow-none border-0'
            onClick={showPasswordHandle}
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
    )
}

export default forwardRef(ShowPasswordButton)
