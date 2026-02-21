import api from "./axios";

export const getMaintenance = ()          => api.get("/maintenance");
export const createMaintenance=(data: any)=> api.post("/maintenance", data);