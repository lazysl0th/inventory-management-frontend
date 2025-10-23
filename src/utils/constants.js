export const titleInfoTooltip = {
    SUCCESS: 'Success!',
    ERROR: 'Error',
}

export const messageInfoTooltip = {
    PASSWORD_RESET: 'Password reset request completed successfully',
    PASSWORD_UPDATE: 'The password has been updated successfully',
    REGISTRATION: {
        SUCCESS: 'Registration completed successfully!',
        ERROR: 'Something went wrong! Try again.',
    },
    RECORDS_DELETE: 'Records deleted success',
    USER_BLOCKED: 'User blocked success',
    USER_UNBLOCKED: 'User unblocked success',
}

export const link = {
    BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost:3001',
    GOOGLE: import.meta.env.VITE_API_GOOGLE_URL ? `${import.meta.env.VITE_API_GOOGLE_URL}` : 'http://localhost:3001/signin/google',
    FACEBOOK: import.meta.env.VITE_API_FACEBOOK_URL ? `${import.meta.env.VITE_API_FACEBOOK_URL}` : 'http://localhost:3001/signin/facebook',
    SINGIN: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/sign-in',
    SIGNUP: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/sign-up',
    PASSWORD_RESET: import.meta.env.VITE_SINGIN_URL ? `${import.meta.env.VITE_SINGIN_URL}` : '/reset-password',
}

export const queryParams = {
    GET_LATEST_INVENTORIES: {
        take: 5,
        createdAt: 'desc'
    },
    GET_TOP_INVENTORIES: {
        take: 5,
        itemsCount: 'desc'
    }
}

export const nameList = {
    LATEST: 'Latest inventories',
    TOP_ITEMS: 'Top 5 by number of items'
}

export const tagCloudColor = {
    luminosity: 'dark',
    hue: 'monochrome',
}