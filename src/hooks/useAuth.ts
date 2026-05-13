"use client";

import { useAuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    ...context,
    // Add any helper methods here
    hasPermission: (permission: string) => {
      // Logic for permission check
      return true;
    }
  };
};

export default useAuth;
