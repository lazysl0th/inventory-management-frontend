export interface Settings {
    urls: {
        apiUrl: string
        wsUrl: string
        googleUrl: string
        facebookUrl: string
    }
    uri: {
        refreshAccessToken: string
    }
    routes: {
        main: string
        search: string
        login: string
        register: string
        userDataDelete: string
        notFound: string
        resetPassword: string
        changePassword: string
        authSuccess: string
        profile: string
        admin: string
        inventories: string
        items: string
        users: string
        deleteUserData: string
        privacy: string
    }
    titleInfoTooltip: {
        success: string
        error: string
    }
    tagsCloudColor: {
        luminosity: 'bright' | 'light' | 'dark'
        hue: string
    }
    base64Chars: string
    adminRole: string
    delay: {
        closeInfoToast: number
        autoSave: number
    }
    tagTypes: {
        Item: string
        Inventory: string
        User: string
        Like: string
        Comment: string
        Info: string
        Me: string
    }
}
