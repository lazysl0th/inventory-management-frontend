import { Link } from 'react-router-dom'
import type { ITextLink } from '../model/types'

const TextLink = ({ text, to, linkText, className = '' }: ITextLink) => {
    return (
        <div className={className}>
            {text && <span className='me-1'>{text}</span>}
            <Link
                to={to}
                className='text-decoration-underline text-dark text-nowrap'
            >
                {linkText}
            </Link>
        </div>
    )
}

export default TextLink
