import { Enrollment, UserRole } from "@prisma/client";
import { BaseDAO } from "./BaseDAO";

interface EnrollmentInput {
  userId: string;
  courseId: string;
  role: UserRole;
}

export class EnrollmentDAO extends BaseDAO<Enrollment> {
  async findAll(): Promise<Enrollment[]> {
    try {
      return await this.prisma.enrollment.findMany({
        include: {
          user: true,
          course: true,
        },
        orderBy: { enrolledAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find all enrollments");
    }
  }

  async findById(id: string): Promise<Enrollment | null> {
    try {
      return await this.prisma.enrollment.findUnique({
        where: { id },
        include: {
          user: true,
          course: true,
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find enrollment by ID");
    }
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    try {
      return await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        include: {
          user: true,
          course: true,
        },
      });
    } catch (error) {
      return this.handleDAOError(
        error as Error,
        "Find enrollment by user and course"
      );
    }
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    try {
      return await this.prisma.enrollment.findMany({
        where: { userId },
        include: {
          user: true,
          course: true,
        },
        orderBy: { enrolledAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find enrollments by user ID");
    }
  }

  async findByCourseId(courseId: string): Promise<Enrollment[]> {
    try {
      return await this.prisma.enrollment.findMany({
        where: { courseId },
        include: {
          user: true,
          course: true,
        },
        orderBy: { enrolledAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(
        error as Error,
        "Find enrollments by course ID"
      );
    }
  }

  async create(data: EnrollmentInput): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.create({
        data,
        include: {
          user: true,
          course: true,
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Create enrollment");
    }
  }

  async update(
    id: string,
    data: Partial<{ role: UserRole }>
  ): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.update({
        where: { id },
        data,
        include: {
          user: true,
          course: true,
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Update enrollment");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.enrollment.delete({
        where: { id },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Delete enrollment");
    }
  }

  async deleteByUserAndCourse(userId: string, courseId: string): Promise<void> {
    try {
      await this.prisma.enrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(
        error as Error,
        "Delete enrollment by user and course"
      );
    }
  }

  async checkUserRole(
    userId: string,
    courseId: string,
    role: UserRole
  ): Promise<boolean> {
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      return enrollment?.role === role;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }
}
