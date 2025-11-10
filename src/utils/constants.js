import dayjs from "dayjs";
import cryptoRandomString from "crypto-random-string";
import { generateNBitRandomNumber } from './utils'

export const initialStateInventory = {
    title: '',
    description: '',
    category: '',
    image: '',
    owner: {id: '', name: ''},
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    customIdFormat: { parts: [], },
    isPublic: false,
    allowedUsers: [],
    fields: [],
    tags: [],
}

export const initialStateItem = {
    values: [],
    owner: {id: '', name: ''},
    customId: '',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
}


export const titleInfoTooltip = {
    SUCCESS: 'Success!',
    ERROR: 'Error',
}

export const messageInfoTooltip = {
    ERROR: 'Something went wrong! Try again.',
    RECORD: {
        DELETE: (recordType) => (`${recordType}(s) deleted success`),
        CREATE: (recordType) => (`${recordType} successfully created!`),
        ERROR: (recordType) => (`An error occurred while creating ${recordType}.`),
    },
    USER: {
        BLOCKED: 'User blocked success',
        UNBLOCKED: 'User unblocked success',
        REGISTRATION: {
            success: 'Registration completed successfully!',
        },
        PERMISSION: {
            GRANT: 'User(s) have been granted administrator privileges',
            REVOKE: 'User(s) have been revoked administrator privileges',
        },
        PASSWORD: {
            RESET: 'Password reset request completed successfully',
            UPDATE: 'The password has been updated successfully',
        }
    },
    RESULT_SEARCH: {
        prefix: 'results.prefix',
        suffix: 'results.suffix'
    },
}

export const link = {
    BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost:3001',
    GOOGLE: import.meta.env.VITE_API_GOOGLE_URL ? `${import.meta.env.VITE_API_GOOGLE_URL}` : 'http://localhost:3001/signin/google',
    FACEBOOK: import.meta.env.VITE_API_FACEBOOK_URL ? `${import.meta.env.VITE_API_FACEBOOK_URL}` : 'http://localhost:3001/signin/facebook',
    SIGNIN: import.meta.env.VITE_SIGNIN_URL ? `${import.meta.env.VITE_SIGNIN_URL}` : '/sign-in',
    SIGNUP: import.meta.env.VITE_SIGNUP_URL ? `${import.meta.env.VITE_SIGNUP_URL}` : '/sign-up',
    DELETE_USER_DATA: import.meta.env.DELETE_USER_DATA ? `${import.meta.env.DELETE_USER_DATA}` : '/delete-user-data',
    PAGE_NOT_FOUND: import.meta.env.PAGE_NOT_FOUND ? `${import.meta.env.PAGE_NOT_FOUND}` : '*',
    PASSWORD_RESET: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/reset-password',
    SEARCH: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/search',

}

export const queryParams = {
    GET_LATEST_INVENTORIES: {
        sortName: 'createdAt',
        take: 5,
        order: 'desc'
    },
    GET_TOP_INVENTORIES: {
        sortName: 'countItems',
        take: 5,
        order: 'desc'
    },
    GET_EDITABLE_INVENTORIES: {
        isPublic: true,
        logic: 'OR'
    },
    SEARCH_INVENTORIES: {
        orderBy: 'DESC'
    }
}

export const NAME_LIST = {
    LATEST: 'LATEST',
    TOP_ITEMS: 'TOP_ITEMS',
    SEARCH: 'SEARCH',
    OWNER: 'OWNER',
    WRITE_ACCESS: 'WRITE_ACCESS',
    ACCESS: 'ACCESS',
    ITEMS: 'ITEMS',
    USERS: 'USERS',
    INVENTORIES: 'INVENTORIES',
    NUM_STATS: 'NUM_STATS',
    TEXT_STATS: 'TEXT_STATS'
}

export const DND_FORM = {
    CUSTOM_ID: {
        TITLE: 'CUSTOM_ID',
        ADD_PART: 'ADD_PART',
    },
    CUSTOM_FIELDS: {
        TITLE: 'CUSTOM_FIELDS',
        ADD_FIELD: 'ADD_FIELD',
    }
}

export const TAGS_CLOUD_COLOR = {
    luminosity: 'dark',
    hue: 'monochrome',
}

export const RECORDS_LIST_HEADS = {
    'Inventory': [
        { id: 'title', header: 'inventory.title', highlightKey: 'highlightedTitle' },
        { id: 'description', header: 'inventory.description', highlightKey: 'highlightedDescription' },
        { id: 'category', header: 'inventory.category' },
        { id: 'owner', header: 'inventory.owner', accessor: value => value?.name },
    ],
    'InventorySearchResult': [
        { id: 'title', header: 'inventorySearchResult.title', highlightKey: 'highlightedTitle' },
        { id: 'description', header: 'inventorySearchResult.description', highlightKey: 'highlightedDescription' },
        { id: 'category', header: 'inventorySearchResult.category' },
        { id: 'owner', header: 'inventorySearchResult.owner', accessor: value => value?.name },
    ],
    'Item': { fieldIdKey: 'id', fieldTitleKey: 'title', fieldValueKey: 'value', fieldCustomIdKey: 'Custom ID'},
    'NumStats': [
        { id: 'field', header: 'numStats.field' },
        { id: 'average', header: 'numStats.average' },
        { id: 'max', header: 'numStats.max' },
        { id: 'min', header: 'numStats.min' },
    ],
    'TextStats': [
        { id: 'field', header: 'textStats.field' },
        { id: 'value', header: 'textStats.value' },
        { id: 'count', header: 'textStats.count' },
    ],
    'User': [
        { id: 'name', header: 'user.name' },
        { id: 'email', header: 'user.email' },
    ],
    'AdminUser': [
        { id: 'name', header: 'adminUser.name' },
        { id: 'email', header: 'adminUser.email' },
        { id: 'status', header: 'adminUser.status' },
        { id: 'roles', header: 'adminUser.roles', accessor: value => value?.map(role => role.role?.name).join(', ') || '-' },
    ]
};

export const roles = {
    USER: 'User',
    ADMIN: 'Admin'
}

export const PART_DEFINITIONS = {
    TEXT: {
        label: "typesCustomId.fixed.label",
        help: 'typesCustomId.fixed.hint',
        formatHelp: "typesCustomId.fixed.formatHint",
        formats: null,
        gen: (part) => String(part.format ?? ""),
    },

    RANDOM20: {
        label: "typesCustomId.20bitRandom.label",
        help: "typesCustomId.20bitRandom.hint",
        formatHelp: "typesCustomId.20bitRandom.formatHint",
        formats: [
            { value: "D6", label: "typesCustomId.20bitRandom.formats.D6" },
            { value: "X5", label: "typesCustomId.20bitRandom.formats.X5" },
        ],
        gen: (part) => { 
                if (part.format === "D6") return generateNBitRandomNumber(20);
                if (part.format === "X5") return generateNBitRandomNumber(20).toString(16);
            },
    },

    RANDOM32: {
        label: "typesCustomId.32bitRandom.label",
        help: "typesCustomId.32bitRandom.hint",
        formatHelp: "typesCustomId.32bitRandom.formatHint",
        formats: [
            { value: "D10", label: "typesCustomId.32bitRandom.formats.D10" },
            { value: "X8",  label: "typesCustomId.32bitRandom.formats.X8" },
        ],
        gen: (part) => {
            if (part.format === "D10") return generateNBitRandomNumber(32);
            if (part.format === "X8") return generateNBitRandomNumber(32).toString(16);
        },
    },

    RANDOM6: {
        label: "typesCustomId.6digitsRandom.label",
        help: "typesCustomId.6digitsRandom.hint",
        formatHelp: "typesCustomId.6digitsRandom.formatHint",
        formats: [{ value: "D6", label: "typesCustomId.6digitsRandom.formats.D6" }],
        gen: () => cryptoRandomString({ length: 6, type: "numeric" }),
    },

    RANDOM9: {
        label: "typesCustomId.9digitsRandom.label",
        help: "typesCustomId.9digitsRandom.hint",
        formatHelp: "typesCustomId.9digitsRandom.formatHint",
        formats: [{ value: "D9", label: "typesCustomId.9digitsRandom.formats.D9" }],
        gen: () => cryptoRandomString({ length: 9, type: "numeric" }),
    },

    GUID: {
        label: "typesCustomId.guid.label",
        help: "typesCustomId.guid.hint",
        formatHelp: "typesCustomId.guid.formatHint",
        formats: null,
        gen: () => crypto.randomUUID()
    },

    DATETIME: {
        label: "typesCustomId.dateTime.label",
        help: "typesCustomId.dateTime.hint",
        formatHelp: "typesCustomId.dateTime.formatHint",
        formats: [
            { value: "YYYY",           label: "typesCustomId.dateTime.formats.YYYY" },
            { value: "YYYYMM",         label: "typesCustomId.dateTime.formats.YYYYMM" },
            { value: "YYYYMMDD",       label: "typesCustomId.dateTime.formats.YYYYMMDD" },
            { value: "YYYYMMDD-HHmm",  label: "typesCustomId.dateTime.formats.YYYYMMDD-HHmm" },
            { value: "YYYYMMDD-HHmmss",label: "typesCustomId.dateTime.formats.YYYYMMDD-HHmmss" },
        ],
        gen: (part) => dayjs().format(part.format || "YYYYMMDD"),
    },

    SEQUENCE: {
        label: "typesCustomId.sequence.label",
        help: "typesCustomId.sequence.hint",
        formatHelp: "typesCustomId.sequence.formatHint",
        formats: [
            { value: "D1",  label: "typesCustomId.sequence.formats.D1" },
            { value: "D2", label: "typesCustomId.sequence.formats.D2" },
            { value: "D3", label: "typesCustomId.sequence.formats.D3" },
            { value: "D4", label: "typesCustomId.sequence.formats.D4" },
        ],
        gen: (part, value = 0) => {
            const len = parseInt(part.format.slice(1), 10);
            return String(value).length < len ? String(value).padStart(len, '0') : value;
        }
    },
};

export const FIELD_TYPES = {
    TEXT: { label: 'TEXT', limit: 3, },
    LONGTEXT: { label: 'LONGTEXT', limit: 3,},
    NUMBER: { label: 'NUMBER', limit: 3, },
    FILE: { label: 'FILE', limit: 3, },
    BOOLEAN: { label: 'BOOLEAN', limit: 3, },
};