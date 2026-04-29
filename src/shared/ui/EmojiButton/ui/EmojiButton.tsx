import { Theme } from 'emoji-picker-react'
import { lazy, Suspense, useState } from 'react'
import type { EmojiClickData } from 'emoji-picker-react'
import type { IEmojiButtonProps } from '../model/types'
import { Button } from '../../Button'
import { Popover } from '../../Popover'

const EmojiPicker = lazy(() => import('emoji-picker-react'))

const EmojiButton = ({ formatValue, onEmojiClick }: IEmojiButtonProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const handleClick = () => setShowEmojiPicker(!showEmojiPicker)

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onEmojiClick(formatValue + emojiData.emoji)
        setShowEmojiPicker(false)
    }

    return (
        <Button
            name='emojiButton'
            variant='dark'
            showOverlay={showEmojiPicker}
            placement='top'
            overlay={
                showEmojiPicker ? (<Popover id='emojiButton'>
                    <Suspense fallback={null}>
                    <EmojiPicker
                        width={280}
                        height={350}
                        theme={Theme.AUTO}
                        onEmojiClick={handleEmojiClick}
                    />
                    </Suspense>
                    
                </Popover>): undefined}
            onClick={handleClick}
        >
            😊
        </Button>
    )
}

export default EmojiButton
