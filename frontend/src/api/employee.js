import api from "./instance/axios";
import { handleApiError, validateId, validatePayload } from "./helpers/apiHelpers";

export async function getOrganizationUsers() {
    try {
        const res = await api.get(`/api/employee/get-employees`);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getOrganizationInactiveUsers() {
    try {
        const res = await api.get(`/api/employee/get-inactive-employees`);
        return res.data;

    } catch (error) {
        handleApiError(error);
    }
}

export async function acceptTask(taskId) {
    validateId(taskId, "Task ID");

    const res = await api.patch(`/api/employee/tasks/accept-task/${taskId}`);
    return res.data;
}

export async function requestRejection({ taskId, ...payload }) {
    validateId(taskId, "Task ID");
    validatePayload(payload);

    const res = await api.patch(`/api/employee/tasks/reject-task/${taskId}`, payload);
    return res.data;
}

export async function markAsCompleted(taskId) {
    validateId(taskId, "Task ID");

    const res = await api.patch(`/api/employee/tasks/mark-as-completed/${taskId}`);
    return res.data;
}

export async function markAsFailed(taskId) {
    validateId(taskId, "Task ID");

    const res = await api.patch(`/api/employee/tasks/mark-as-failed/${taskId}`);
    return res.data;
}