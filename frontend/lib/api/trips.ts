import api from "./axios";

export const getTrips   = ()          => api.get("/trips");
export const createTrip = (data: any) => api.post("/trips", data);
export const updateTrip = (id: number, data: any) => api.put(`/trips/${id}`, data);
export const deleteTrip = (id: number)=> api.delete(`/trips/${id}`);
