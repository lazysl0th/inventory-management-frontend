import { TagCloud } from 'react-tagcloud'
import type { ITagsCloudProps } from '../model/types'
import { COLOR_OPTIONS } from '../config/settings'
import { Loader } from '@/shared/ui/Loader'
import { Message } from '@/shared/ui/Message'

const TagsCloud = ({
    data,
    isLoading,
    error,
    minFontSize,
    maxFontSize,
}: ITagsCloudProps) => {
    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger' error={error} />
    ) : (
        <TagCloud
            minSize={minFontSize}
            maxSize={maxFontSize}
            tags={data.map((tag) => ({
                value: tag.name,
                count: tag._count.inventories,
            }))}
            colorOptions={COLOR_OPTIONS}
        />
    )
}

export default TagsCloud
