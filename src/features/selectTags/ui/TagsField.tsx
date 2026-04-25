import { useTranslation } from 'react-i18next'
import { useGetTagsQuery } from '@/features/tag/api/tagApi'
import { ITagsFieldProps, TCreatableTag } from '../model/types'
import { CreatableSelect } from '@/shared/ui/Form'

const TagsField = ({ disabled }: ITagsFieldProps) => {
    const { t } = useTranslation('inventory')

    const { data: tags = [], isLoading: tagsIsLoading } = useGetTagsQuery()

    const getOptionLabel = (tag: TCreatableTag) => tag.name

    const getOptionValue = (tag: TCreatableTag) => tag.id.toString()

    const formatCreateLabel = (inputValue: string) => (
        <span>
            Create new tag: <b>{inputValue}</b>
        </span>
    )

    const formatOptionLabel = (tag: TCreatableTag) => tag.label || tag.name

    const getNewOptionData = (
        inputValue: string,
        optionLabel: React.ReactNode
    ) => ({
        id: crypto.randomUUID(),
        name: inputValue,
        label: optionLabel,
        __isNew__: true,
    })

    return (
        <CreatableSelect<TCreatableTag, true>
            name='tags'
            label={t('labels.tags')}
            isMulti
            placeholder='Enter text...'
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            formatCreateLabel={formatCreateLabel}
            formatOptionLabel={formatOptionLabel}
            getNewOptionData={getNewOptionData}
            onChange={() => {}}
            options={tags}
            isLoading={tagsIsLoading}
            isDisabled={disabled}
        />
    )
}

export default TagsField
