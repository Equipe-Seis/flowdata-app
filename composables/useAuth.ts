import { useState, useRuntimeConfig, useCookie } from "nuxt/app";
import { computed } from "vue";
import { loginRequest, refreshTokenRequest } from "~/services/auth/authService";

type AuthUser = {
  id?: string | number;
  email?: string;
  name?: string;
  [key: string]: unknown;
} | null;

export const useAuth = () => {
  const config = useRuntimeConfig();

  const user = useState<AuthUser>("user", () => null);
  const accessToken = useState<string | null>("access_token", () => null);
  const refreshToken = useState<string | null>("refresh_token", () => null);

  const tokenCookie = useCookie<string | null>("auth_token", { sameSite: "lax" });
  const refreshCookie = useCookie<string | null>("refresh_token", { sameSite: "lax" });

  if (!accessToken.value && tokenCookie.value) {
    accessToken.value = tokenCookie.value;
  }
  if (!refreshToken.value && refreshCookie.value) {
    refreshToken.value = refreshCookie.value;
  }

  const isAuthenticated = computed(() => !!accessToken.value);

  const login = async (email: string, password: string, remember = true) => {
    const apiBase = config.public.apiBase as string;
    const result = await loginRequest(apiBase, email, password);
    if (!result || (!result.token && !result.access_token)) {
      return false;
    }

    const token = (result.token || result.access_token) as string;
    const rToken = (result.refresh_token || result.refreshToken) as string | undefined;
    const profile = (result.user || { email }) as AuthUser;

    accessToken.value = token;
    user.value = profile;
    tokenCookie.value = token;

    if (rToken) {
      refreshToken.value = rToken;
      refreshCookie.value = rToken;
    }

    if (remember) {
      (tokenCookie as any).maxAge = 60 * 60 * 24 * 7;
      (refreshCookie as any).maxAge = 60 * 60 * 24 * 30;
    } else {
      (tokenCookie as any).maxAge = undefined;
      (refreshCookie as any).maxAge = undefined;
    }

    return true;
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    tokenCookie.value = null;
    refreshCookie.value = null;
  };

  const tryRefresh = async () => {
    if (!refreshToken.value) return false;
    const apiBase = config.public.apiBase as string;
    const result = await refreshTokenRequest(apiBase, refreshToken.value);
    if (!result || (!result.token && !result.access_token)) return false;
    const token = (result.token || result.access_token) as string;
    accessToken.value = token;
    tokenCookie.value = token;
    return true;
  };

  const getAuthHeader = () =>
    accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {};

  return { user, accessToken, isAuthenticated, login, logout, tryRefresh, getAuthHeader };
};
