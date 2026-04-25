import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useState } from 'react'
import { MouseDownEvent } from 'emoji-picker-react/dist/config/config'
import { IEmojiButtonProps } from '../model/types'
import { Button } from '../../Button'
import { Popover } from '../../Popover'

const EmojiButton = ({ formatValue, onEmojiClick }: IEmojiButtonProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const handleClick = () => setShowEmojiPicker(!showEmojiPicker)

    const handleEmojiClick: MouseDownEvent = (emojiData) => {
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
                <Popover id='emojiButton'>
                    <EmojiPicker
                        width={280}
                        height={350}
                        theme={Theme.AUTO}
                        onEmojiClick={handleEmojiClick}
                    />
                </Popover>
            }
            //label='😊'
            onClick={handleClick}
        >
            😊
        </Button>
    )
}

export default EmojiButton
