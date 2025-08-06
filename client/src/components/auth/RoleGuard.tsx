"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  courseId?: string;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  courseId,
  fallback = null,
}) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // If courseId is provided, check specific course role
  if (courseId) {
    const hasRequiredRole = allowedRoles.some((role) =>
      hasRole(courseId, role)
    );
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  } else {
    // Check general user role
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};
