import { link } from './constants';

const apiConfig = {
  baseUrl: link.BASE_URL,
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  })
};

const checkResponse = async (res) => {
    if (res.ok) return res.json();
    const e = await res.json();
    return Promise.reject(e);
}

export const register = async ({ name, email, password }) => {
    const res =  await fetch(`${apiConfig.baseUrl}/signup`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ name, email, password })
    })
    return checkResponse(res);
}

export const login = async ({ email, password }) => {
    const res = await fetch(`${apiConfig.baseUrl}/signin`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ email, password })
    })
    return checkResponse(res); 
}

export const checkToken = async () => {
    const res = await fetch(`${apiConfig.baseUrl}/users/me`, {
        method: 'GET',
        headers: apiConfig.headers(),
    });
  return await checkResponse(res);
}



export function logout() {
  return fetch(`${apiConfig.baseUrl}/signout`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => (checkResponse(res)))
}

export function updateProfile({ name, email }) {
  return fetch(`${apiConfig.baseUrl}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: apiConfig.headers,
    body: JSON.stringify({ name, email })
  })
    .then((res) => checkResponse(res))
}

export function getSavedMovies() {
  return fetch(`${apiConfig.baseUrl}/movies`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => checkResponse(res))
}

export function saveMovie({
  country,
  director,
  duration,
  year,
  description,
  image,
  trailer,
  thumbnail,
  movieId,
  nameRU,
  nameEN
}) {

  return fetch(`${apiConfig.baseUrl}/movies`, {
    method: 'POST',
    credentials: 'include',
    headers: apiConfig.headers,
    body: JSON.stringify({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    })
  })
    .then((res) => checkResponse(res))
}

export function deleteSavedMovie(movieId) {
  return fetch(`${apiConfig.baseUrl}/movies/${movieId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: apiConfig.headers,
  })
    .then((res) => checkResponse(res));
}
