import { Image } from 'react-bootstrap'
import './ImagePreview.scss'
import type { IImagePreviewProps } from '../model/types'

const ImagePreview = ({ imageUrl, alt, placeholder }: IImagePreviewProps) => {
    return imageUrl ? (
        <Image
            src={imageUrl}
            alt={alt}
            thumbnail
            className='image-preview mb-2'
        />
    ) : (
        <div className='border rounded d-flex align-items-center justify-content-center p-3 text-muted image-preview mb-2'>
            {placeholder}
        </div>
    )
}

export default ImagePreview
