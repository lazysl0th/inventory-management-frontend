import { checkResponse } from "./usersApi";
import { link } from "./constants";

export const uploadImage = async (formData) => {
    const res = await fetch(`${link.BASE_URL}/image`, {
        method: "POST",
        body: formData,
    });
    return checkResponse(res);
}