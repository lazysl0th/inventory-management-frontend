import { Image } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import './ImagePreview.scss'
import { IImagePreviewProps } from '../model/types'

const ImagePreview = ({ imageUrl }: IImagePreviewProps) => {
    const { t } = useTranslation('inventory')

    return imageUrl ? (
        <Image
            src={imageUrl}
            alt='Preview'
            thumbnail
            className='image-preview mb-2'
        />
    ) : (
        <div className='border rounded d-flex align-items-center justify-content-center p-3 text-muted image-preview mb-2'>
            {t('placeholders.noImage')}
        </div>
    )
}

export default ImagePreview
