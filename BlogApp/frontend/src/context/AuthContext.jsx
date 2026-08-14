import { useState, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    if (!token) return undefined;

    API.get("/auth/me")
      .then(({ data }) => {
        if (!isMounted) return;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Login function
  const login = async (emailOrData, password) => {
    if (
      typeof emailOrData === "object" &&
      emailOrData !== null &&
      emailOrData.token
    ) {
      localStorage.setItem("token", emailOrData.token);
      setUser(emailOrData);
      return;
    }

    const { data } = await API.post("/auth/login", {
      email: emailOrData,
      password,
    });

    localStorage.setItem("token", data.token);
    setUser(data);
  };

  // Register function
  const register = async (formData) => {
    if (
      typeof formData === "object" &&
      formData !== null &&
      formData.token
    ) {
      localStorage.setItem("token", formData.token);
      setUser(formData);
      return;
    }

    const { data } = await API.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    setUser(data);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
