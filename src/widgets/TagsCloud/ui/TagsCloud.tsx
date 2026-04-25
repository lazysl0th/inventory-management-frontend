import { TagCloud } from 'react-tagcloud'
import { ITagsCloudProps } from '../model/types'
import { useGetTagsQuery } from '@/features/tag'

const TagsCloud = ({
    minFontSize,
    maxFontSize,
    colorOptions,
}: ITagsCloudProps) => {
    const { data: tags = [] } = useGetTagsQuery()

    return (
        <TagCloud
            minSize={minFontSize}
            maxSize={maxFontSize}
            tags={tags.map((tag) => ({
                value: tag.name,
                count: tag._count.inventories,
            }))}
            colorOptions={colorOptions}
        />
    )
}

export default TagsCloud
