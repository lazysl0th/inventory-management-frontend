import {
    PartIdFormat,
    PartIdTypes,
    SeparatorPosition,
} from '@/entities/inventory'
import type {
    PartIdSettings,
    TDateTimeFormats,
    TRandom20BitNumberFormats,
    TRandom32BitNumberFormats,
    TRandom6DigitFormat,
    TRandom9DigitFormat,
    TSequenceFormats,
} from './types'

const random20BitNumberFormatsSettings: Record<
    TRandom20BitNumberFormats,
    string
> = {
    [PartIdFormat.D6]: 'typesCustomId.20bitRandom.formats.D6',
    [PartIdFormat.X5]: 'typesCustomId.20bitRandom.formats.X5',
}

const random32BitNumberFormatsSettings: Record<
    TRandom32BitNumberFormats,
    string
> = {
    [PartIdFormat.D10]: 'typesCustomId.32bitRandom.formats.D10',
    [PartIdFormat.X8]: 'typesCustomId.32bitRandom.formats.X8',
}

const random6DigitFormatSetting: Record<TRandom6DigitFormat, string> = {
    [PartIdFormat.D6]: 'typesCustomId.6digitsRandom.formats.D6',
}

const random9DigitFormatSetting: Record<TRandom9DigitFormat, string> = {
    [PartIdFormat.D9]: 'typesCustomId.9digitsRandom.formats.D9',
}

const dateTimeFormatsSettings: Record<TDateTimeFormats, string> = {
    [PartIdFormat.YYYY]: 'typesCustomId.dateTime.formats.YYYY',
    [PartIdFormat.YYYYMM]: 'typesCustomId.dateTime.formats.YYYYMM',
    [PartIdFormat.YYYYMMDD]: 'typesCustomId.dateTime.formats.YYYYMMDD',
    [PartIdFormat.YYYYMMDDHHmm]: 'typesCustomId.dateTime.formats.YYYYMMDD-HHmm',
    [PartIdFormat.YYYYMMDDHHmmss]:
        'typesCustomId.dateTime.formats.YYYYMMDD-HHmmss',
}

const sequenceFormatsSettings: Record<TSequenceFormats, string> = {
    [PartIdFormat.D1]: 'typesCustomId.sequence.formats.D1',
    [PartIdFormat.D2]: 'typesCustomId.sequence.formats.D2',
    [PartIdFormat.D3]: 'typesCustomId.sequence.formats.D3',
    [PartIdFormat.D4]: 'typesCustomId.sequence.formats.D4',
}

export const partIdSettings: Record<PartIdTypes, PartIdSettings> = {
    [PartIdTypes.Text]: {
        label: 'typesCustomId.fixed.label',
        formats: '',
        hint: 'typesCustomId.fixed.hint',
        formatHint: 'typesCustomId.fixed.formatHint',
    },
    [PartIdTypes.Random20BitNumber]: {
        label: 'typesCustomId.20bitRandom.label',
        formats: random20BitNumberFormatsSettings,
        hint: 'typesCustomId.20bitRandom.hint',
        formatHint: 'typesCustomId.20bitRandom.formatHint',
    },
    [PartIdTypes.Random32BitNumber]: {
        label: 'typesCustomId.32bitRandom.label',
        formats: random32BitNumberFormatsSettings,
        hint: 'typesCustomId.32bitRandom.hint',
        formatHint: 'typesCustomId.32bitRandom.formatHint',
    },
    [PartIdTypes.Random6Digits]: {
        label: 'typesCustomId.6digitsRandom.label',
        formats: random6DigitFormatSetting,
        hint: 'typesCustomId.6digitsRandom.hint',
        formatHint: 'typesCustomId.6digitsRandom.formatHint',
    },
    [PartIdTypes.Random9Digits]: {
        label: 'typesCustomId.9digitsRandom.label',
        formats: random9DigitFormatSetting,
        hint: 'typesCustomId.9digitsRandom.hint',
        formatHint: 'typesCustomId.9digitsRandom.formatHint',
    },
    [PartIdTypes.Guid]: {
        label: 'typesCustomId.guid.label',
        formats: null,
        hint: 'typesCustomId.guid.hint',
        formatHint: 'typesCustomId.guid.formatHint',
    },
    [PartIdTypes.DateTime]: {
        label: 'typesCustomId.dateTime.label',
        formats: dateTimeFormatsSettings,
        hint: 'typesCustomId.dateTime.hint',
        formatHint: 'typesCustomId.dateTime.formatHint',
    },
    [PartIdTypes.Sequence]: {
        label: 'typesCustomId.sequence.label',
        formats: sequenceFormatsSettings,
        hint: 'typesCustomId.sequence.hint',
        formatHint: 'typesCustomId.sequence.formatHint',
    },
}

const separatorPosition: Record<SeparatorPosition, string> = {
    [SeparatorPosition.Prefix]: 'options.before',
    [SeparatorPosition.Suffix]: 'options.after',
}
