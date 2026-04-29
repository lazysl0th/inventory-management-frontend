const { NODE_ENV, API_URL, WS_URL } = process.env

const isProd = NODE_ENV === 'production'

export const BASE_API = isProd && API_URL ? API_URL : 'http://localhost:3001'

export const BASE_WSAPI = isProd && WS_URL ? WS_URL : 'http://localhost:3001'

export const GOOGLE_AUTH_URL = `${BASE_API}/signin/google`

export const FACEBOOK_AUTH_URL = `${BASE_API}/signin/facebook`
