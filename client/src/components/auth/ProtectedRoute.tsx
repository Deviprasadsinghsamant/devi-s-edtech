"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Loading } from "@/components/ui/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading>Checking authentication...</Loading>;
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 text-center">
              Please log in to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 text-center">
              You don't have permission to access this page.
              {requiredRole && (
                <span className="block mt-2 text-sm">
                  Required role: {requiredRole}
                </span>
              )}
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
