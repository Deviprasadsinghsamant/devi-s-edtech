import { CourseService } from "../../services/CourseService";
import { CourseLevel } from "@prisma/client";

const courseService = new CourseService();

interface CourseFilter {
  level?: CourseLevel;
  hasEnrollments?: boolean;
}

interface UpdateCourseInput {
  title?: string;
  description?: string;
  level?: CourseLevel;
}

export const courseResolvers = {
  Query: {
    courses: async (_: any, { filter }: { filter?: CourseFilter }) => {
      return await courseService.getAllCourses(filter);
    },

    course: async (_: any, { id }: { id: string }) => {
      return await courseService.getCourseById(id);
    },

    courseCount: async () => {
      return await courseService.getCourseCount();
    },
  },

  Mutation: {
    createCourse: async (
      _: any,
      {
        input,
      }: { input: { title: string; description: string; level: CourseLevel } }
    ) => {
      return await courseService.createCourse(input);
    },

    updateCourse: async (
      _: any,
      { id, input }: { id: string; input: UpdateCourseInput },
      context: any
    ) => {
      const userId = context.user?.id;
      return await courseService.updateCourse(id, input, userId);
    },

    deleteCourse: async (_: any, { id }: { id: string }) => {
      await courseService.deleteCourse(id);
      return true;
    },
  },

  Course: {
    enrollmentCount: async (parent: any) => {
      const stats = await courseService.getCourseStats(parent.id);
      return stats.enrollmentCount;
    },

    professorCount: async (parent: any) => {
      const stats = await courseService.getCourseStats(parent.id);
      return stats.professorCount;
    },

    studentCount: async (parent: any) => {
      const stats = await courseService.getCourseStats(parent.id);
      return stats.studentCount;
    },
  },
};
