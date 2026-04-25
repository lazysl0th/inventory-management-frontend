import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function isObject(obj: unknown): obj is object {
    return typeof obj === 'object' && obj != null
}

export function isFetchBaseQueryError(
    error: unknown
): error is FetchBaseQueryError {
    return isObject(error) && 'status' in error
}

/*


export const generateNBitRandomNumber = (bit) => {
    const bytes = Math.ceil(bit / 8)
    const buffer = new Uint8Array(bytes)
    window.crypto.getRandomValues(buffer)
    let numBigInt = 0n
    for (let i = 0; i < bytes; i++) {
        numBigInt = (numBigInt << 8n) | BigInt(buffer[i])
    }
    const mask = (1n << BigInt(bit)) - 1n
    return numBigInt & mask
}

const upsertById = (serverData = [], localData = [], key = 'id') => {
    const map = new Map(serverData.map((prop) => [prop[key], prop]))
    for (const data of localData)
        map.set(data[key], { ...(map.get(data[key]) || {}), ...data })
    return Array.from(map.values())
}

export const mergeInventory = (server, local) => ({
    ...server,
    ...local,
    tags: upsertById(server.tags, local.tags, 'id'),
    fields: upsertById(server.fields, local.fields, 'id'),
    allowedUsers: upsertById(server.allowedUsers, local.allowedUsers, 'id'),
})

export const mergeItem = (server, local) => ({
    ...server,
    ...local,
    values: upsertById(
        server.values?.map((v) => ({ ...v, id: v.id, value: v.value })) ?? [],
        local.values?.map((v) => ({ ...v, id: v.id, value: v.value })) ?? [],
        'id'
    ),
})
*/
