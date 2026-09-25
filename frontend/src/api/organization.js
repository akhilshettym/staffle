import api from "./instance/axios";
import { validateId, validatePayload, handleApiError } from "./helpers/apiHelpers";

export async function updateOrganization({ orgId, ...payload }) {
    validateId(orgId, "Organization ID");
    validatePayload(payload);

    try {
        const res = await api.patch(`/api/organization/update-organization/${orgId}`, payload);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getOrganizationDetails() {
    const res = await api.get(`/api/organization/get-organization-details`);
    return res.data;
}