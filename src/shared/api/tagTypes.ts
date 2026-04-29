export const TAG_TYPES = {
    ITEM: 'Item',
    INVENTORY: 'Inventory',
    USER: 'User',
    LIKE: 'Like',
    COMMENT: 'Comment',
    INFO: 'Info',
    ME: 'Me',
} as const

export const TAG_TYPES_LIST = Object.values(TAG_TYPES)
