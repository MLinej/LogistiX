import api from "./axios";

export const getFuelLogs = ()          => api.get("/fuellogs");
export const createFuelLog=(data: any) => api.post("/fuellogs", data);
