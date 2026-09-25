import api from "./instance/axios";
import { validatePayload, handleAuthError } from "./helpers/apiHelpers";

export async function createOrganization(payload) {
    validatePayload(payload);

    try {
        const res = await api.post(`/api/auth/create-organization`, payload);
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
}

export async function login(payload) {
    validatePayload(payload);

    try {
        const res = await api.post(`/api/auth/login`, payload);
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
}

export async function logoutUser() {
    try {
        const res = await api.post(`/api/auth/logout`);
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
}