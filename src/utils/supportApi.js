import { checkResponse, apiConfig } from './usersApi';

export const sendSupportRequest = async({ userName, userEmail, inventory, link, priority, request }) => {
    const res = await fetch(`${apiConfig.baseUrl}/support`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ userName, userEmail, inventory, link, priority, request })
    })
    return checkResponse(res);
}