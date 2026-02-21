import api from "./axios";

export const login = (email: string, password: string) =>
  api.post("/users/login", { email, password });

export const register = (name: string, email: string, password: string, role: string) =>
  api.post("/users/register", { name, email, password, role });