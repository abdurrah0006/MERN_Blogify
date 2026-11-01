import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "./auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True while we verify a saved token, so protected pages don't bounce to /login on refresh.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  useEffect(() => {
    if (!localStorage.getItem("token")) return undefined;
    let active = true;

    API.get("/auth/me")
      .then(({ data }) => active && setUser(data))
      .catch((error) => {
        // Only forget the token when the server rejects it, not when it's merely offline.
        if (error.response?.status === 401) localStorage.removeItem("token");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (path, body) => {
    const { data } = await API.post(path, body);
    const { token, ...profile } = data;
    localStorage.setItem("token", token);
    setUser(profile);
  }, []);

  const login = useCallback((credentials) => authenticate("/auth/login", credentials), [authenticate]);
  const register = useCallback((details) => authenticate("/auth/register", details), [authenticate]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser: setUser }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
