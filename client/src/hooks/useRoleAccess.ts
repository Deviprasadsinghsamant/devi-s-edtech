import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export const useRoleAccess = () => {
  const { user, hasRole, isEnrolledInCourse, getUserRoleInCourse } = useAuth();

  const canCreateCourse = () => {
    // For now, any authenticated user can create courses
    // In a real app, you might want to add admin permissions
    return !!user;
  };

  const canEditCourse = (courseId: string) => {
    return hasRole(courseId, UserRole.PROFESSOR);
  };

  const canDeleteCourse = (courseId: string) => {
    return hasRole(courseId, UserRole.PROFESSOR);
  };

  const canManageCourse = (courseId: string) => {
    return hasRole(courseId, UserRole.PROFESSOR);
  };

  const canEnrollInCourse = (courseId: string) => {
    return user && !isEnrolledInCourse(courseId);
  };

  const canUnenrollFromCourse = (courseId: string) => {
    return user && isEnrolledInCourse(courseId);
  };

  const canViewCourseDetails = (courseId: string) => {
    return isEnrolledInCourse(courseId) || isProfessorOfCourse(courseId);
  };

  const isProfessor = () => {
    // Check if user is a professor in any course
    return user?.enrollments?.some(enrollment => enrollment.role === UserRole.PROFESSOR) || false;
  };

  const isStudent = () => {
    // Check if user is a student in any course
    return user?.enrollments?.some(enrollment => enrollment.role === UserRole.STUDENT) || false;
  };

  const isProfessorOfCourse = (courseId: string) => {
    return hasRole(courseId, UserRole.PROFESSOR);
  };

  const isStudentOfCourse = (courseId: string) => {
    return hasRole(courseId, UserRole.STUDENT);
  };

  return {
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canManageCourse,
    canEnrollInCourse,
    canUnenrollFromCourse,
    canViewCourseDetails,
    isProfessor,
    isStudent,
    isProfessorOfCourse,
    isStudentOfCourse,
    user,
    getUserRoleInCourse,
    isEnrolledInCourse,
  };
};
