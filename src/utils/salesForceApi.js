import { link } from './constants';
import { checkResponse } from './usersApi';

const apiConfig = {
  baseUrl: link.BASE_URL,
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  })
};

export const getAddress = async() => {
    const res = await fetch(`${apiConfig.baseUrl}/salesForce/address`, {
        method: 'GET',
        headers: apiConfig.headers(),
    })
    return checkResponse(res)
}

export const addAdditionInfo = async({ Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet }, userId) => {
    const res = await fetch(`${apiConfig.baseUrl}/salesForce/addInfo`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet, userId })
    })
    return checkResponse(res)
}

export const getAdditionalInfo = async(userId) => {
    const res = await fetch(`${apiConfig.baseUrl}/salesForce/getInfo`, {
        method: 'POST',
        headers: apiConfig.headers(),
        body: JSON.stringify({ userId })

    })
    return checkResponse(res)
}
