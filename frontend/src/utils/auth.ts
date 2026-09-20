export interface AuthUser {
  id: number;
  name?: string;
  email?: string;
}

export const saveAuthData = (token: string, user: AuthUser) => {
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const getUser = (): AuthUser | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};
