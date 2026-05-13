"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setAuthToken, setContentToken, notifyContentTokenReady } from "@/services/api/axios";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("qf_access_token");
    localStorage.removeItem("qf_user");
    setAccessToken(null);
    setUser(null);
    setAuthToken("");
    // Optionally redirect to signin
    window.location.href = "/login";
  }, []);

  const login = useCallback(() => {
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Fetch Content Token (Global for all users)
        const contentTokenRes = await axios.get("/api/auth/content-token");
        if (contentTokenRes.data.access_token) {
          setContentToken(contentTokenRes.data.access_token);
        }

        // 2. Initialize User Auth
        const storedToken = localStorage.getItem("qf_access_token");
        const storedUser = localStorage.getItem("qf_user");

        if (storedToken) {
          setAccessToken(storedToken);
          setAuthToken(storedToken);
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        // Always ungate content API requests, even if token fetch failed
        notifyContentTokenReady();
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
