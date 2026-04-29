const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

const CHAR_LOOKUP = new Int8Array(123).fill(-1)

for (let i = 0; i < BASE64_CHARS.length; i++) {
    CHAR_LOOKUP[BASE64_CHARS.charCodeAt(i)] = i
}

export function isBitSet(validFor: string, index: number): boolean {
    const charIndex = (index / 6) | 0
    if (charIndex >= validFor.length) return false
    const charCode = validFor.charCodeAt(charIndex)
    if (charCode > 122) return false
    const bits = CHAR_LOOKUP[charCode]
    if (bits === -1) return false
    const bitIndex = index % 6
    return ((bits >> (5 - bitIndex)) & 1) === 1
}
