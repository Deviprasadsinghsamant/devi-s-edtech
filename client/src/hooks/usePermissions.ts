import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface Permission {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export const usePermissions = () => {
  const { user, hasRole, isEnrolledInCourse } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;

    const { resource, action, context } = permission;

    switch (resource) {
      case "course":
        return handleCoursePermissions(action, context);
      case "enrollment":
        return handleEnrollmentPermissions(action, context);
      case "user":
        return handleUserPermissions(action, context);
      default:
        return false;
    }
  };

  const handleCoursePermissions = (
    action: string,
    context?: Record<string, any>
  ): boolean => {
    const courseId = context?.courseId;

    switch (action) {
      case "create":
        return user?.role === UserRole.PROFESSOR;
      case "read":
        return true; // All authenticated users can read courses
      case "update":
        return courseId ? hasRole(courseId, UserRole.PROFESSOR) : false;
      case "delete":
        return courseId ? hasRole(courseId, UserRole.PROFESSOR) : false;
      case "manage":
        return courseId ? hasRole(courseId, UserRole.PROFESSOR) : false;
      default:
        return false;
    }
  };

  const handleEnrollmentPermissions = (
    action: string,
    context?: Record<string, any>
  ): boolean => {
    const courseId = context?.courseId;
    const targetUserId = context?.userId;

    switch (action) {
      case "enroll":
        return (
          user?.role === UserRole.STUDENT &&
          courseId &&
          !isEnrolledInCourse(courseId)
        );
      case "unenroll":
        return (
          user?.role === UserRole.STUDENT &&
          courseId &&
          isEnrolledInCourse(courseId)
        );
      case "manage":
        return courseId ? hasRole(courseId, UserRole.PROFESSOR) : false;
      case "view":
        return courseId ? isEnrolledInCourse(courseId) : false;
      default:
        return false;
    }
  };

  const handleUserPermissions = (
    action: string,
    context?: Record<string, any>
  ): boolean => {
    const targetUserId = context?.userId;

    switch (action) {
      case "read":
        return true; // All authenticated users can read basic user info
      case "update":
        return targetUserId === user?.id; // Users can only update themselves
      case "delete":
        return targetUserId === user?.id; // Users can only delete themselves
      default:
        return false;
    }
  };

  const checkMultiplePermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    checkMultiplePermissions,
    checkAnyPermission,
  };
};
