const { NODE_ENV, API_URL, WS_URL } = process.env

const isProd = process.env.NODE_ENV === 'production'

export const BASE_API = isProd && process.env.API_URL ? process.env.API_URL : 'http://localhost:3001'

export const BASE_WSAPI = isProd && process.env.WS_URL ? process.env.WS_URL : 'http://localhost:3001'

export const GOOGLE_AUTH_URL = `${BASE_API}/signin/google`

export const FACEBOOK_AUTH_URL = `${BASE_API}/signin/facebook`
