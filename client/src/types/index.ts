export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum UserRole {
  STUDENT = "STUDENT",
  PROFESSOR = "PROFESSOR",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  enrollments: Enrollment[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  enrollmentCount: number;
  studentCount: number;
  professorCount: number;
  createdAt: string;
  updatedAt: string;
  enrollments: Enrollment[];
}

export interface Enrollment {
  id: string;
  role: UserRole;
  enrolledAt: string;
  user: User;
  course: Course;
}

// Input Types
export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  level: CourseLevel;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  level?: CourseLevel;
}

export interface EnrollmentInput {
  userId: string;
  courseId: string;
  role: UserRole;
}

export interface CourseFilter {
  level?: CourseLevel;
  hasEnrollments?: boolean;
}

// Auth Types
export interface AuthPayload {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginInput {
  email: string;
}
