import api from "./api";
export const makeAuthenticatedRequest = async (method, url, data, token) => {
    const config = {
        method,
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data,
    };

    try {
        const response = await api(config);
        return response.data;
    } catch (error) {
        throw error;
    }
};