import { PartIdFormat } from '@/entities/inventory'

export const partIdFormatRegexPattern: Record<PartIdFormat, string> = {
    [PartIdFormat.D1]: '\\d{1}',
    [PartIdFormat.D2]: '\\d{2}',
    [PartIdFormat.D3]: '\\d{3}',
    [PartIdFormat.D4]: '\\d{4}',
    [PartIdFormat.D6]: '\\d{6}',
    [PartIdFormat.D9]: '\\d{9}',
    [PartIdFormat.D10]: '\\d{10}',

    [PartIdFormat.X5]: '[A-Fa-f0-9]{5}',
    [PartIdFormat.X8]: '[A-Fa-f0-9]{8}',

    [PartIdFormat.YYYY]: '\\d{4}',
    [PartIdFormat.YYYYMM]: '\\d{6}',
    [PartIdFormat.YYYYMMDD]: '\\d{8}',

    [PartIdFormat.YYYYMMDDHHmm]: '\\d{8}-\\d{4}',
    [PartIdFormat.YYYYMMDDHHmmss]: '\\d{8}-\\d{6}',
}

export const guidRegexPattern =
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}'
