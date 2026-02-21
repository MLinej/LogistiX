import api from "./axios";

export const getVehicles  = ()          => api.get("/vehicles");
export const getVehicle   = (id: number)=> api.get(`/vehicles/${id}`);
export const createVehicle= (data: any) => api.post("/vehicles", data);
export const updateVehicle= (id: number, data: any) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle= (id: number)=> api.delete(`/vehicles/${id}`);