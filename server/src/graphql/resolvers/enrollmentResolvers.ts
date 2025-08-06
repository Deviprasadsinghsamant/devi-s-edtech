import { EnrollmentService } from "../../services/EnrollmentService";
import { UserRole } from "@prisma/client";

const enrollmentService = new EnrollmentService();

interface EnrollmentInput {
  userId: string;
  courseId: string;
  role: UserRole;
}

export const enrollmentResolvers = {
  Query: {
    userEnrollments: async (_: any, { userId }: { userId: string }) => {
      return await enrollmentService.getUserEnrollments(userId);
    },

    courseEnrollments: async (_: any, { courseId }: { courseId: string }) => {
      return await enrollmentService.getCourseEnrollments(courseId);
    },
  },

  Mutation: {
    enrollInCourse: async (_: any, { input }: { input: EnrollmentInput }) => {
      return await enrollmentService.enrollUser(input);
    },

    unenrollFromCourse: async (
      _: any,
      { userId, courseId }: { userId: string; courseId: string }
    ) => {
      return await enrollmentService.unenrollUser(userId, courseId);
    },

    updateEnrollmentRole: async (
      _: any,
      { id, role }: { id: string; role: UserRole }
    ) => {
      return await enrollmentService.updateEnrollmentRole(id, role);
    },
  },
};
