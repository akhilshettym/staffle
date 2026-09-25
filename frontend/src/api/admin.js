import api from "./instance/axios";
import { validateId, validatePayload, handleAdminError, handleApiError } from "./helpers/apiHelpers";

export async function updateAdmin({ empId, ...payload }) {
    validateId(empId, "Admin ID (empId)");
    validatePayload(payload);

    try {
        const res = await api.patch(`/api/admin/update-admin/${empId}`, payload);
        return res.data;
    } catch (error) {
        handleAdminError(error);
    }
}

export async function reviewRejection({ taskId, ...payload }) {
    validateId(taskId, "Task ID (taskId)");
    validatePayload(payload);

    try {
        const res = await api.patch(`/api/admin/tasks/review-task-rejection/${taskId}`, payload);
        return res.data;
    } catch (error) {
        handleAdminError(error);
    }
}

export async function addEmployee(payload) {
    validatePayload(payload);

    try {
        const res = await api.post(`/api/admin/add-employee`, payload);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function updateEmployee({ empId, ...payload }) {
    validateId(empId, "Employee ID (empId)");
    validatePayload(payload);

    try {
        const res = await api.patch(`/api/employee/update-employee/${empId}`, payload);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function deactivateEmployee({ empId }) {
    validateId(empId, "Employee ID (empId)");

    try {
        const res = await api.patch(`/api/admin/deactivate-employee/${empId}`);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function reactivateEmployee({ empId }) {
    validateId(empId, "Employee ID (empId)");

    try {
        const res = await api.patch(`/api/admin/reactivate-employee/${empId}`);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function createTask(payload) {
    validatePayload(payload);

    const res = await api.post(`/api/admin/tasks/create-task`, payload);
    return res.data;
}

export async function updateTask({ taskId, ...payload }) {
    validateId(taskId, "Task ID");
    validatePayload(payload);

    try {
        const res = await api.patch(`/api/admin/tasks/update-task/${taskId}`, payload);
        return res.data;
        
    } catch (error) {
        handleApiError(error);
    }
}

export async function deleteTask({ taskId }) {
    validateId(taskId, "Task ID");

    try {
        const res = await api.delete(`/api/admin/tasks/delete-task/${taskId}`);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
}