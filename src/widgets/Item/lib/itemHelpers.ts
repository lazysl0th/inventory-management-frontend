import {
    IPartId,
    PartIdFormat,
    PartIdTypes,
    SeparatorPosition,
} from '@/entities/inventory/model/types'
import {
    guidRegexPattern,
    partIdFormatRegexPattern,
} from '../model/regexPattern'

const connectSeparator = (
    example: string,
    separator: string,
    position: SeparatorPosition | null
) => {
    if (!position || !separator) return example
    return position === SeparatorPosition.Suffix
        ? example + separator
        : separator + example
}

const getRegex = (
    partType: PartIdTypes | null,
    partFormat: PartIdFormat | null
) => {
    switch (partType) {
        case PartIdTypes.Text:
            return partFormat
        case PartIdTypes.Guid:
            return guidRegexPattern
        default:
            return partFormat && partIdFormatRegexPattern[partFormat]
    }
}

export const getFormatCustomId = (partId: IPartId) => {
    const regex = getRegex(partId.type, partId.format)
    return regex && connectSeparator(regex, partId.separator, partId.position)
}
