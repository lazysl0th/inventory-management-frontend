import { Settings } from '../../types/settings'

const { NODE_ENV, API_URL, WS_URL } = process.env

export const SETTINGS: Settings = {
    urls: {
        apiUrl:
            NODE_ENV === 'production' && API_URL
                ? API_URL
                : 'http://localhost:3001',
        wsUrl:
            NODE_ENV === 'production' && WS_URL
                ? WS_URL
                : 'ws://localhost:3001',
        googleUrl:
            NODE_ENV === 'production' && API_URL
                ? `${API_URL}/signin/google`
                : 'http://localhost:3001/signin/google',
        facebookUrl:
            NODE_ENV === 'production' && API_URL
                ? `${API_URL}/signin/facebook`
                : 'http://localhost:3001/signin/facebook',
    },
    uri: {
        refreshAccessToken: '/refreshAccessToken',
    },
    routes: {
        main: '/',
        search: '/search',
        login: '/sign-in',
        register: '/sign-up',
        userDataDelete: '/delete-user-data',
        notFound: '*',
        resetPassword: '/reset-password',
        changePassword: '/change-password',
        authSuccess: '/auth-success',
        profile: '/profile',
        admin: '/admin',
        inventories: 'inventories',
        items: 'items',
        users: 'users',
        deleteUserData: '/delete-user-data',
        privacy: '/privacy',
    },
    titleInfoTooltip: {
        success: 'Success',
        error: 'Error',
    },
    tagsCloudColor: {
        luminosity: 'dark',
        hue: 'monochrome',
    },
    base64Chars:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    adminRole: 'Admin',
    delay: {
        closeInfoToast: 5000,
        autoSave: 10000,
    },
    tagTypes: {
        Item: 'Item',
        Inventory: 'Inventory',
        User: 'User',
        Like: 'Like',
        Comment: 'Comment',
        Info: 'Info',
        Me: 'Me',
    },
}

/*

export const titleInfoTooltip = {
    SUCCESS: 'modals.titleSuccess',
    ERROR: 'modals.titleError',
}

export const messageInfoTooltip = {
    ERROR: 'modals.messageError',
    RECORD: {
        DELETE: 'records.delete',
        CREATE: 'records.create',
        ERROR: 'records.error',
    },
    USER: {
        BLOCKED: 'modals.blocked',
        UNBLOCKED: 'modals.unblocked',
        REGISTRATION: {
            success: 'modals.registrationSuccess',
        },
        PERMISSION: {
            GRANT: 'modals.grant',
            REVOKE: 'modals.revoke',
        },
        PASSWORD: {
            RESET: 'modals.resetPassword',
            UPDATE: 'modals.updatePassword',
        },
    },
    RESULT_SEARCH: {
        prefix: 'results.prefix',
        suffix: 'results.suffix',
    },
}

export const link = {
    BASE_URL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}`
        : 'http://localhost:3001',
    GOOGLE: import.meta.env.VITE_API_GOOGLE_URL
        ? `${import.meta.env.VITE_API_GOOGLE_URL}`
        : 'http://localhost:3001/signin/google',
    FACEBOOK: import.meta.env.VITE_API_FACEBOOK_URL
        ? `${import.meta.env.VITE_API_FACEBOOK_URL}`
        : 'http://localhost:3001/signin/facebook',
    SIGNIN: import.meta.env.VITE_SIGNIN_URL
        ? `${import.meta.env.VITE_SIGNIN_URL}`
        : '/sign-in',
    SIGNUP: import.meta.env.VITE_SIGNUP_URL
        ? `${import.meta.env.VITE_SIGNUP_URL}`
        : '/sign-up',
    DELETE_USER_DATA: import.meta.env.DELETE_USER_DATA
        ? `${import.meta.env.DELETE_USER_DATA}`
        : '/delete-user-data',
    PAGE_NOT_FOUND: import.meta.env.PAGE_NOT_FOUND
        ? `${import.meta.env.PAGE_NOT_FOUND}`
        : '*',
    PASSWORD_RESET: import.meta.env.VITE_PASSWORD_RESET
        ? `${import.meta.env.VITE_PASSWORD_RESET}`
        : '/reset-password',
    PASSWORD_CHANGE: import.meta.env.VITE_PASSWORD_CHANGE
        ? `${import.meta.env.VITE_PASSWORD_CHANGE}`
        : '/change-password',
    SEARCH: import.meta.env.VITE_SEARCH
        ? `${import.meta.env.VITE_SEARCH}`
        : '/search',
}

export const TAGS_CLOUD_COLOR = {
    luminosity: 'dark',
    hue: 'monochrome',
}


export const roles = {
    USER: 'User',
    ADMIN: 'Admin',
}

export const PART_DEFINITIONS = {
    TEXT: {
        label: 'typesCustomId.fixed.label',
        help: 'typesCustomId.fixed.hint',
        formatHelp: 'typesCustomId.fixed.formatHint',
        formats: null,
        gen: (part) => String(part.format ?? ''),
    },

    RANDOM20: {
        label: 'typesCustomId.20bitRandom.label',
        help: 'typesCustomId.20bitRandom.hint',
        formatHelp: 'typesCustomId.20bitRandom.formatHint',
        formats: [
            { value: 'D6', label: 'typesCustomId.20bitRandom.formats.D6' },
            { value: 'X5', label: 'typesCustomId.20bitRandom.formats.X5' },
        ],
        gen: (part) => {
            if (part.format === 'D6') return generateNBitRandomNumber(20)
            if (part.format === 'X5')
                return generateNBitRandomNumber(20).toString(16)
        },
    },

    RANDOM32: {
        label: 'typesCustomId.32bitRandom.label',
        help: 'typesCustomId.32bitRandom.hint',
        formatHelp: 'typesCustomId.32bitRandom.formatHint',
        formats: [
            { value: 'D10', label: 'typesCustomId.32bitRandom.formats.D10' },
            { value: 'X8', label: 'typesCustomId.32bitRandom.formats.X8' },
        ],
        gen: (part) => {
            if (part.format === 'D10') return generateNBitRandomNumber(32)
            if (part.format === 'X8')
                return generateNBitRandomNumber(32).toString(16)
        },
    },

    RANDOM6: {
        label: 'typesCustomId.6digitsRandom.label',
        help: 'typesCustomId.6digitsRandom.hint',
        formatHelp: 'typesCustomId.6digitsRandom.formatHint',
        formats: [
            { value: 'D6', label: 'typesCustomId.6digitsRandom.formats.D6' },
        ],
        gen: () => cryptoRandomString({ length: 6, type: 'numeric' }),
    },

    RANDOM9: {
        label: 'typesCustomId.9digitsRandom.label',
        help: 'typesCustomId.9digitsRandom.hint',
        formatHelp: 'typesCustomId.9digitsRandom.formatHint',
        formats: [
            { value: 'D9', label: 'typesCustomId.9digitsRandom.formats.D9' },
        ],
        gen: () => cryptoRandomString({ length: 9, type: 'numeric' }),
    },

    GUID: {
        label: 'typesCustomId.guid.label',
        help: 'typesCustomId.guid.hint',
        formatHelp: 'typesCustomId.guid.formatHint',
        formats: null,
        gen: () => crypto.randomUUID(),
    },

    DATETIME: {
        label: 'typesCustomId.dateTime.label',
        help: 'typesCustomId.dateTime.hint',
        formatHelp: 'typesCustomId.dateTime.formatHint',
        formats: [
            { value: 'YYYY', label: 'typesCustomId.dateTime.formats.YYYY' },
            { value: 'YYYYMM', label: 'typesCustomId.dateTime.formats.YYYYMM' },
            {
                value: 'YYYYMMDD',
                label: 'typesCustomId.dateTime.formats.YYYYMMDD',
            },
            {
                value: 'YYYYMMDD-HHmm',
                label: 'typesCustomId.dateTime.formats.YYYYMMDD-HHmm',
            },
            {
                value: 'YYYYMMDD-HHmmss',
                label: 'typesCustomId.dateTime.formats.YYYYMMDD-HHmmss',
            },
        ],
        gen: (part) => dayjs().format(part.format || 'YYYYMMDD'),
    },

    SEQUENCE: {
        label: 'typesCustomId.sequence.label',
        help: 'typesCustomId.sequence.hint',
        formatHelp: 'typesCustomId.sequence.formatHint',
        formats: [
            { value: 'D1', label: 'typesCustomId.sequence.formats.D1' },
            { value: 'D2', label: 'typesCustomId.sequence.formats.D2' },
            { value: 'D3', label: 'typesCustomId.sequence.formats.D3' },
            { value: 'D4', label: 'typesCustomId.sequence.formats.D4' },
        ],
        gen: (part, value = 0) => {
            const len = parseInt(part.format.slice(1), 10)
            return String(value).length < len
                ? String(value).padStart(len, '0')
                : value
        },
    },
}

export const FIELD_TYPES = {
    TEXT: { label: 'TEXT', limit: 3 },
    LONGTEXT: { label: 'LONGTEXT', limit: 3 },
    NUMBER: { label: 'NUMBER', limit: 3 },
    FILE: { label: 'FILE', limit: 3 },
    BOOLEAN: { label: 'BOOLEAN', limit: 3 },
}
*/
