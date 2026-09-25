import api from "./instance/axios";
import { handleApiError, validateId, validatePayload } from "./helpers/apiHelpers";

export async function getAllOrganizationDetails() {
    const res = await api.get(`/api/superadmin/get-all-organizations-details`);
    return res.data;
}

export async function getSpecificOrganizationDetails(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.get(`/api/superadmin/get-specific-organization-details/${orgId}`);
    return res.data;
}

export async function getOrganizationSpecificEmployeeDetails(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.get(`/api/superadmin/get-org-specific-employees/${orgId}`);
    return res.data;
}

export async function getOrganizationSpecificTasksDetails(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.get(`/api/superadmin/get-org-specific-tasks/${orgId}`);
    return res.data;
}

export async function getAllEmployeesDetails() {
    const res = await api.get(`/api/superadmin/get-all-employees-details`);
    return res.data;
}

export async function getAlltasksDetails() {
    const res = await api.get(`/api/superadmin/get-all-tasks-details`);
    return res.data;
}

export async function approveOrganization(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.patch(`/api/superadmin/approve-organization/${orgId}`);
    return res.data;
}

export async function rejectOrganization(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.patch(`/api/superadmin/reject-organization/${orgId}`);
    return res.data;
}

export async function revokeOrganization(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.patch(`/api/superadmin/revoke-organization/${orgId}`);
    return res.data;
}

export async function reActivateOrganization(orgId) {
    validateId(orgId, "Organization ID");

    const res = await api.patch(`/api/superadmin/re-activate-organization/${orgId}`);
    return res.data;
}

export async function deleteRejectedOrganization({ orgId }) {
    validateId(orgId, "Organization ID");

    try {
        const res = await api.delete(`/api/superadmin/delete-rejected-organization/${orgId}`);
        return res.data;

    } catch (error) {
        handleApiError(error);
    }
}

export async function addAdmin(payload) {
    validatePayload(payload);

    try {
        const res = await api.post(`/api/superadmin/add-admin`, payload);
        return res.data;

    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

export async function deleteAdminEmployee({ empId }) {
    validateId(empId, "Emp ID");

    try {
        const res = await api.delete(`/api/superadmin/delete-admin-employee/${empId}`);
        return res.data;

    } catch (error) {
        handleApiError(error);
    }
}

export async function createNewTask({ orgId, payload }) {
    validatePayload(payload);

    const res = await api.post(`/api/superadmin/create-tasks/${orgId}`, payload );

    return res.data;
}

export async function updateNewTask({ orgId, taskId, payload }) {
  validatePayload(payload);

  const res = await api.patch(`/api/superadmin/update-task/org/${orgId}/task/${taskId}`, payload );

  return res.data;
}