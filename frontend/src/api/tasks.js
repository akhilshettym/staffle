import api from "./instance/axios";

export async function getTaskDetails() {
    const res = await api.get(`/api/tasks/get-tasks-details`);
    return res.data;
}