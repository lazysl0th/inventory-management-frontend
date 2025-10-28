export const titleInfoTooltip = {
    SUCCESS: 'Success!',
    ERROR: 'Error',
}

export const messageInfoTooltip = {
    PASSWORD_RESET: 'Password reset request completed successfully',
    PASSWORD_UPDATE: 'The password has been updated successfully',
    REGISTRATION: {
        success: 'Registration completed successfully!',
    },
    ERROR: 'Something went wrong! Try again.',
    RECORDS_DELETE: 'Records deleted success',
    USER_BLOCKED: 'User blocked success',
    USER_UNBLOCKED: 'User unblocked success',
    RESULT_SEARCH: {
        prefix: 'No results found for ',
        suffix: '. Try another search term.'
    }
}

export const link = {
    BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost:3001',
    GOOGLE: import.meta.env.VITE_API_GOOGLE_URL ? `${import.meta.env.VITE_API_GOOGLE_URL}` : 'http://localhost:3001/signin/google',
    FACEBOOK: import.meta.env.VITE_API_FACEBOOK_URL ? `${import.meta.env.VITE_API_FACEBOOK_URL}` : 'http://localhost:3001/signin/facebook',
    SINGIN: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/sign-in',
    SIGNUP: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/sign-up',
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
    WRITE_ACCESS: 'Inventories with write access'
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
    'Item': { fieldIdKey: 'id', fieldTitleKey: 'title', fieldValueKey: 'value' },
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
    ]
};
