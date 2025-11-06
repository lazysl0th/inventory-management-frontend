import dayjs from "dayjs";
import cryptoRandomString from "crypto-random-string";

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
        prefix: 'No results found for ',
        suffix: '. Try another search term.'
    },
}

export const link = {
    BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost:3001',
    GOOGLE: import.meta.env.VITE_API_GOOGLE_URL ? `${import.meta.env.VITE_API_GOOGLE_URL}` : 'http://localhost:3001/signin/google',
    FACEBOOK: import.meta.env.VITE_API_FACEBOOK_URL ? `${import.meta.env.VITE_API_FACEBOOK_URL}` : 'http://localhost:3001/signin/facebook',
    SIGNIN: import.meta.env.VITE_SIGNIN_URL ? `${import.meta.env.VITE_SIGNIN_URL}` : '/sign-in',
    SIGNUP: import.meta.env.VITE_SIGNUP_URL ? `${import.meta.env.VITE_SIGNUP_URL}` : '/sign-up',
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

export const nameList = {
    LATEST: 'Latest inventories',
    TOP_ITEMS: 'Top 5 by number of items',
    SEARCH: 'Search result',
    OWNER: 'My inventories',
    WRITE_ACCESS: 'Inventories with write access',
    ACCESS: 'Users with write access',
    ITEMS: 'Items',
    USERS: 'Users',
    INVENTORIES: 'Inventories'
}

export const TAGS_CLOUD_SOLOR = {
    luminosity: 'dark',
    hue: 'monochrome',
}

export const RECORDS_LIST_HEADS = {
    'Inventory': [
        { id: 'title', header: 'Title', highlightKey: 'highlightedTitle' },
        { id: 'description', header: 'Description', highlightKey: 'highlightedDescription' },
        { id: 'category', header: 'Category' },
        { id: 'owner', header: 'Owner', accessor: value => value?.name },
    ],
    'InventorySearchResult': [
        { id: 'title', header: 'Title', highlightKey: 'highlightedTitle' },
        { id: 'description', header: 'Description', highlightKey: 'highlightedDescription' },
        { id: 'category', header: 'Category' },
        { id: 'owner', header: 'Owner', accessor: value => value?.name },
    ],
    'Item': { fieldIdKey: 'id', fieldTitleKey: 'title', fieldValueKey: 'value', fieldCustomIdKey: 'Custom ID'},
    'CustomIdPart': [
        { id: 'type', header: 'Type' },
        { id: 'value', header: 'Value' },
        { id: 'format', header: 'Format' },
        { id: 'digits', header: 'Digits' },
    ],
    'InventoryField': [
        { id: 'title', header: 'Title' },
        { id: 'type', header: 'Type' },
        { id: 'description', header: 'Description' },
        { id: 'visible', header: 'Show in Table' },
        { id: 'order', header: 'Order' },
        { id: 'status', header: 'Status' },
    ],
    'User': [
        { id: 'name', header: 'Name' },
        { id: 'email', header: 'Email' },
    ],
    'AdminUser': [
        { id: 'name', header: 'Name' },
        { id: 'email', header: 'Email' },
        { id: 'status', header: 'Status' },
        { id: 'roles', header: 'Roles', accessor: value => value?.map(role => role.role?.name).join(', ') || '-' },
    ]
};

export const roles = {
    USER: 'User',
    ADMIN: 'Admin'
}

export const PART_DEFINITIONS = {
    TEXT: {
        label: "Fixed",
        help: "A piece of unchanging text. You can use Unicode or emoji.",
        formatHelp: "Optional. Leave empty, value will be used as-is.",
        formats: null,
        gen: (part) => String(part.format ?? ""),
        example: (part) => String(part.format ?? ""),
    },

    RANDOM20: {
        label: "20-bit random",
        help: "A random value. E.g., format as six-digit decimal (D6) or 5-digit hex (X5).",
        formatHelp: "Choose how to represent the random bits.",
        formats: [
            { value: "D6",  label: "Decimal D6 (000000)" },
            { value: "X5",  label: "Hex X5 (00000..fffff)" },
            { value: "B20", label: "Binary B20" },
        ],
        gen: (part) => {
            const format = part.format || "D6";
                if (format === "D6")  return cryptoRandomString({ length: 6, type: "numeric" });
                if (format === "X5")  return cryptoRandomString({ length: 5, type: "hex" });
                if (format === "B20") return cryptoRandomString({ length: 20, characters: "01" });
                return cryptoRandomString({ length: 6, type: "numeric" });
            },
        example: (part) => {
            const format = part.format || "D6";
            if (format === "D6") return "025413";
            if (format === "X5") return "a7e3a";
            if (format === "B20") return "01001101100100101011";
            return "025413";
        },
    },

    RANDOM32: {
        label: "32-bit random",
        help: "A 32-bit random. Format as decimal (D10) or hex (X8).",
        formatHelp: "Choose the representation.",
        formats: [
            { value: "D10", label: "Decimal D10 (0000000000)" },
            { value: "X8",  label: "Hex X8 (00000000..ffffffff)" },
        ],
        gen: (part) => {
            const format = part.format || "X8";
            if (format === "D10") return cryptoRandomString({ length: 10, type: "numeric" });
            return cryptoRandomString({ length: 8, type: "hex" });
        },
        example: (part) => (part.format === "D10" ? "3812405791" : "7af2c01b"),
    },

    RANDOM6: {
        label: "6-digit random",
        help: "A six-digit random number.",
        formatHelp: "Fixed length decimal.",
        formats: [{ value: "D6", label: "Decimal D6 (000000)" }],
        gen: () => cryptoRandomString({ length: 6, type: "numeric" }),
        example: () => "013245",
    },

    RANDOM9: {
        label: "9-digit random",
        help: "A nine-digit random number.",
        formatHelp: "Fixed length decimal.",
        formats: [{ value: "D9", label: "Decimal D9 (000000000)" }],
        gen: () => cryptoRandomString({ length: 9, type: "numeric" }),
        example: () => "123456789",
    },

    GUID: {
        label: "GUID",
        help: "Automatically generated UUID v4.",
        formatHelp: "No format is required.",
        formats: null,
        gen: () =>
            typeof crypto?.randomUUID === "function"
                ? crypto.randomUUID()
                : cryptoRandomString({ length: 32, type: "hex" }).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, "$1-$2-$3-$4-$5"),
        example: () => "91d2b6a0-f3c2-4f99-9245-fdb517b83af8",
    },

    DATETIME: {
        label: "Date/time",
        help: "An item creation date/time.",
        formatHelp: "Pick a common pattern or use a custom one.",
        formats: [
            { value: "YYYY",           label: "YYYY" },
            { value: "YYYYMM",         label: "YYYYMM" },
            { value: "YYYYMMDD",       label: "YYYYMMDD" },
            { value: "YYYYMMDD-HHmm",  label: "YYYYMMDD-HHmm" },
            { value: "YYYYMMDD-HHmmss",label: "YYYYMMDD-HHmmss" },
        ],
        gen: (part) => dayjs().format(part.format || "YYYYMMDD"),
        example: (part) => dayjs("2025-01-23T13:45:00").format(part.format || "YYYYMMDD"),
    },

    SEQUENCE: {
        label: "Sequence (+1)",
        help: "A sequential index. E.g., with leading zeros (D4) or without (D).",
        formatHelp: "Choose width: D, D2, D3, D4…",
        formats: [
            { value: "D1",  label: "1, 2, 3" },
            { value: "D2", label: "01, 02, 03" },
            { value: "D3", label: "001, 002, 003" },
            { value: "D4", label: "0001, 0002, 0003" },
        ],
        gen: (part, value = 0) => {
            const len = parseInt(part.format.slice(1), 10);
            return String(value).length < len ? String(value).padStart(len, '0') : value;
        },
        example: (part) => {
            const len = parseInt(part.format.slice(1), 10);
            return String(value).length < len ? String(value).padStart(len, '0') : value;
        },
    },
};

export const FIELD_TYPES = {
    TEXT: { label: "Single-line text", limit: 3, },
    LONGTEXT: { label: "Multi-line text", limit: 3,},
    NUMBER: { label: "Numeric", limit: 3, },
    FILE: { label: "File / Image Link", limit: 3, },
    BOOLEAN: { label: "True / False", limit: 3, },
};