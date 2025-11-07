import { link } from './constants';

const apiConfig = {
  baseUrl: link.BASE_URL,
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  })
};

export const checkResponse = async (res) => {
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

export const getUsers = async() => {
    const res = await fetch(`${apiConfig.baseUrl}/users`, {
        headers: apiConfig.headers()
    });
    return await checkResponse(res);
}

export const changeUsersStatus = async(usersIds, status) => {
    const res = await fetch(`${apiConfig.baseUrl}/users/status`, {
        method: 'PATCH',
        headers: apiConfig.headers(),
        body: JSON.stringify({ usersIds: usersIds, status: status })
    });
    return await checkResponse(res);
}

export const deleteUsers = async(usersIds) => {
    const res = await fetch(`${apiConfig.baseUrl}/users/`, {
        method: 'DELETE',
        headers: apiConfig.headers(),
        body: JSON.stringify({ usersIds: usersIds })
    });
    return await checkResponse(res);
}

export const changeAccess = async(usersIds, roleIds) => {
    const res = await fetch(`${apiConfig.baseUrl}/users/roles/`, {
        method: 'PATCH',
        headers: apiConfig.headers(),
        body: JSON.stringify({ usersIds: usersIds, rolesIds: roleIds })
    });
    return await checkResponse(res);
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


