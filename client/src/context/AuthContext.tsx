"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/lib/graphql/mutations";
import { User, UserRole, AuthPayload } from "@/types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (courseId: string, role: UserRole) => boolean;
  isEnrolledInCourse: (courseId: string) => boolean;
  getUserRoleInCourse: (courseId: string) => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ register: AuthPayload }>(
    REGISTER_MUTATION
  );

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const register = async (input: RegisterInput): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { user: userData, token } = data.register;

        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      console.error("Register error:", error);
      throw new Error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (input: LoginInput): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        const { user: userData, token } = data.login;

        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const refreshUser = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email: user.email,
            password: "password123",
          },
        },
      });

      if (data?.login) {
        const { user: userData, token } = data.login;
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const hasRole = (courseId: string, role: UserRole): boolean => {
    if (!user) return false;

    return user.enrollments.some(
      (enrollment) =>
        enrollment.course.id === courseId && enrollment.role === role
    );
  };

  const isEnrolledInCourse = (courseId: string): boolean => {
    if (!user) return false;

    return user.enrollments.some(
      (enrollment) => enrollment.course.id === courseId
    );
  };

  const getUserRoleInCourse = (courseId: string): UserRole | null => {
    if (!user) return null;

    const enrollment = user.enrollments.find(
      (enrollment) => enrollment.course.id === courseId
    );

    return enrollment ? enrollment.role : null;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
    refreshUser,
    hasRole,
    isEnrolledInCourse,
    getUserRoleInCourse,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
