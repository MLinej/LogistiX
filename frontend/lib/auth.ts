import { login as loginApi } from "@/lib/api";

export async function signIn(email: string, password: string) {
  const res = await loginApi(email, password);
  const { token, user } = res.data;
  localStorage.setItem("lx_token", token);
  localStorage.setItem("lx_user", JSON.stringify(user));
  return user;
}

export function signOut() {
  localStorage.removeItem("lx_token");
  localStorage.removeItem("lx_user");
  window.location.href = "/";
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("lx_user");
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lx_token");
}

export function isAuthenticated() {
  return !!getToken();
}