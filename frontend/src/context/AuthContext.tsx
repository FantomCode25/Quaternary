"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  remainingUploads: number;
  decrementUploads: () => void;
  canUpload: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingUploads, setRemainingUploads] = useState<number>(3);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on initial load
    async function loadUserFromCookies() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromCookies();
  }, []);

  useEffect(() => {
    if (!user) {
      // Only load from localStorage if not logged in
      const storedUploads = localStorage.getItem("quaternary_remainingUploads");
      if (storedUploads !== null) {
        setRemainingUploads(parseInt(storedUploads));
      } else {
        // Initialize with default value
        localStorage.setItem("quaternary_remainingUploads", "3");
      }
    } else {
      // If user is logged in, clear localStorage but keep state
      localStorage.removeItem("quaternary_remainingUploads");
    }
  }, [user]);

  useEffect(() => {
    if (!user && remainingUploads >= 0) {
      localStorage.setItem(
        "quaternary_remainingUploads",
        remainingUploads.toString()
      );
    }
  }, [remainingUploads, user]);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration error", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  }

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      // Clear any auth tokens from localStorage
      localStorage.removeItem("authToken");
      // Any other cleanup

      // Check if the user is on the community page when logging out
      if (pathname === "/community") {
        // Redirect to home page
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  }, [router, pathname]);

  const decrementUploads = useCallback(() => {
    if (!user && remainingUploads > 0) {
      const newCount = remainingUploads - 1;
      setRemainingUploads(newCount);
      console.log(`Decremented uploads. Remaining: ${newCount}`);
    }
  }, [remainingUploads, user]);

  const canUpload = useCallback(() => {
    if (user) return true; // Logged in users have unlimited uploads
    return remainingUploads > 0;
  }, [remainingUploads, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        remainingUploads,
        decrementUploads,
        canUpload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
