import {
    type IPartId,
    PartIdFormat,
    PartIdTypes,
    SeparatorPosition,
} from '@/entities/inventory'
import cryptoRandomString from 'crypto-random-string'
import dayjs from 'dayjs'

const generateNBitRandomNumber = (bit: number): bigint => {
    const bytes = Math.ceil(bit / 8)
    const buffer = new Uint8Array(bytes)
    window.crypto.getRandomValues(buffer)
    let numBigInt = BigInt(0)
    for (const byte of buffer)
        numBigInt = (numBigInt << BigInt(8)) | BigInt(byte)
    const mask = (BigInt(1) << BigInt(bit)) - BigInt(1)
    return numBigInt & mask
}

const generateExample = (
    partType: PartIdTypes | null,
    partFormat: PartIdFormat | null
) => {
    if (!partType) return
    switch (partType) {
        case PartIdTypes.Text:
            return partFormat
        case PartIdTypes.Random20BitNumber:
            if (partFormat === PartIdFormat.X5)
                return generateNBitRandomNumber(20).toString(16)
            if (partFormat === PartIdFormat.D6)
                return generateNBitRandomNumber(20).toString()
            break
        case PartIdTypes.Random32BitNumber:
            if (partFormat === PartIdFormat.X8)
                return generateNBitRandomNumber(32).toString(16)
            if (partFormat === PartIdFormat.D10)
                return generateNBitRandomNumber(32).toString()
            break
        case PartIdTypes.Random6Digits:
            return cryptoRandomString({ length: 6, type: 'numeric' })
        case PartIdTypes.Random9Digits:
            return cryptoRandomString({ length: 9, type: 'numeric' })
        case PartIdTypes.Guid:
            return crypto.randomUUID()
        case PartIdTypes.DateTime:
            if (partFormat) return dayjs().format(partFormat)

            break
        case PartIdTypes.Sequence:
            if (partFormat === null) return
            const targetLength = parseInt(partFormat.slice(1), 10)
            if (!isNaN(targetLength))
                return String(targetLength).padStart(targetLength, '0')
            break
    }
}

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

export const getPartIdExample = (partId: IPartId) => {
    const example = generateExample(partId.type, partId.format)
    if (!example) return ''
    return connectSeparator(example, partId.separator, partId.position)
}
