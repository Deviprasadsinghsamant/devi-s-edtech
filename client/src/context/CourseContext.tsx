"use client";

import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COURSES, GET_COURSE_BY_ID } from "@/lib/graphql/queries";
import {
  ENROLL_IN_COURSE,
  UPDATE_COURSE,
  UNENROLL_FROM_COURSE,
} from "@/lib/graphql/mutations";
import {
  Course,
  CourseFilter,
  UpdateCourseInput,
  EnrollmentInput,
} from "@/types";
import { useAuth } from "@/context/AuthContext";

interface CourseContextType {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  fetchCourses: (filter?: CourseFilter) => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  enrollInCourse: (input: EnrollmentInput) => Promise<void>;
  unenrollFromCourse: (userId: string, courseId: string) => Promise<void>;
  updateCourse: (id: string, updates: UpdateCourseInput) => Promise<void>;
  refetchCourses: () => void;
  refetchCurrentCourse: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};

interface CourseProviderProps {
  children: React.ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const {
    data: coursesData,
    loading: coursesLoading,
    refetch: refetchCoursesQuery,
    error: coursesError,
  } = useQuery<{ courses: Course[] }>(GET_COURSES);

  const { refetch: refetchCourseQuery } = useQuery<{ course: Course }>(
    GET_COURSE_BY_ID,
    {
      skip: true,
    }
  );

  const [enrollMutation] = useMutation(ENROLL_IN_COURSE);
  const [unenrollMutation] = useMutation(UNENROLL_FROM_COURSE);
  const [updateCourseMutation] = useMutation(UPDATE_COURSE);

  const courses = coursesData?.courses || [];
  const loading = coursesLoading;

  const fetchCourses = async (filter?: CourseFilter): Promise<void> => {
    try {
      setError(null);
      await refetchCoursesQuery(filter ? { filter } : undefined);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch courses";
      setError(errorMessage);
      console.error("Error fetching courses:", err);
    }
  };

  const fetchCourse = async (id: string): Promise<void> => {
    try {
      setError(null);
      const { data } = await refetchCourseQuery({ id });
      if (data?.course) {
        setCurrentCourse(data.course);
      } else {
        throw new Error("Course not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch course";
      setError(errorMessage);
      console.error("Error fetching course:", err);
    }
  };

  const enrollInCourse = async (input: EnrollmentInput): Promise<void> => {
    try {
      setError(null);

      await enrollMutation({
        variables: { input },
        refetchQueries: [
          { query: GET_COURSES },
          { query: GET_COURSE_BY_ID, variables: { id: input.courseId } },
        ],
        awaitRefetchQueries: true,
      });

      await refreshUser();

      if (currentCourse?.id === input.courseId) {
        await fetchCourse(input.courseId);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to enroll in course";
      setError(errorMessage);
      console.error("Error enrolling in course:", err);
      throw err;
    }
  };

  const unenrollFromCourse = async (
    userId: string,
    courseId: string
  ): Promise<void> => {
    try {
      setError(null);

      await unenrollMutation({
        variables: { userId, courseId },
        refetchQueries: [
          { query: GET_COURSES },
          { query: GET_COURSE_BY_ID, variables: { id: courseId } },
        ],
        awaitRefetchQueries: true,
      });

      if (currentCourse?.id === courseId) {
        await fetchCourse(courseId);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unenroll from course";
      setError(errorMessage);
      console.error("Error unenrolling from course:", err);
      throw err;
    }
  };

  const updateCourse = async (
    id: string,
    updates: UpdateCourseInput
  ): Promise<void> => {
    try {
      setError(null);

      const { data } = await updateCourseMutation({
        variables: { id, input: updates },
        refetchQueries: [
          { query: GET_COURSES },
          { query: GET_COURSE_BY_ID, variables: { id } },
        ],
        awaitRefetchQueries: true,
      });

      if (currentCourse?.id === id && data?.updateCourse) {
        setCurrentCourse(data.updateCourse);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update course";
      setError(errorMessage);
      console.error("Error updating course:", err);
      throw err;
    }
  };

  const refetchCourses = () => {
    refetchCoursesQuery();
  };

  const refetchCurrentCourse = () => {
    if (currentCourse?.id) {
      fetchCourse(currentCourse.id);
    }
  };

  React.useEffect(() => {
    if (coursesError) {
      setError(coursesError.message);
    }
  }, [coursesError]);

  const value: CourseContextType = {
    courses,
    currentCourse,
    loading,
    error,
    fetchCourses,
    fetchCourse,
    enrollInCourse,
    unenrollFromCourse,
    updateCourse,
    refetchCourses,
    refetchCurrentCourse,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};
