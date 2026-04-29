import type { ISectionProps } from '../model/types'

const Section = ({ children, className = '' }: ISectionProps) => {
    return (
        <div className={`d-flex flex-column gap-2 mb-3 ${className}`}>
            {children}
        </div>
    )
}

export default Section
