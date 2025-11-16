import { checkResponse, apiConfig } from './usersApi';

export const getInventoryToken = async(inventoryId) => {
    const res = await fetch(`${apiConfig.baseUrl}/inventories/getToken`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ inventoryId })

    });
    return await checkResponse(res);
}