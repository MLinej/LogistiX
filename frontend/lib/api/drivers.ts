import api from "./axios";

export const getDrivers  = ()          => api.get("/drivers");
export const getDriver   = (id: number)=> api.get(`/drivers/${id}`);
export const createDriver= (data: any) => api.post("/drivers", data);
export const updateDriver= (id: number, data: any) => api.put(`/drivers/${id}`, data);
export const deleteDriver= (id: number)=> api.delete(`/drivers/${id}`);