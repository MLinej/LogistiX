import api from "./axios";

export const getAlerts     = ()          => api.get("/alerts");
export const resolveAlert  = (id: number)=> api.patch(`/alerts/${id}/resolve`);
export const dismissAlert  = (id: number)=> api.patch(`/alerts/${id}/dismiss`);