import { Button } from '@/shared/ui/Button'
import socialButtons from '../model/socialButtonRegistry'

const SocialButtons = () => {
    return (
        <div className='d-flex justify-content-center gap-4 py-2'>
            {socialButtons.map(({ icon: Icon, ...button }, index) => {
                return (
                    <Button
                        as='a'
                        key={index}
                        href={button.href}
                        target='_self'
                        rel='noopener noreferrer'
                        variant=''
                        className='border-0 rounded-circle'
                    >
                        <Icon size={button.size} color={button.color} />
                    </Button>
                )
            })}
        </div>
    )
}

export default SocialButtons
