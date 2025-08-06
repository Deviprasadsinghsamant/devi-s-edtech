import { Course, CourseLevel } from "@prisma/client";
import { BaseDAO } from "./BaseDAO";

interface CourseFilter {
  level?: CourseLevel;
  hasEnrollments?: boolean;
}

interface UpdateCourseInput {
  title?: string;
  description?: string;
  level?: CourseLevel;
}

export class CourseDAO extends BaseDAO<Course> {
  async findAll(filter?: CourseFilter): Promise<Course[]> {
    try {
      const where: any = {};

      if (filter?.level) {
        where.level = filter.level;
      }

      if (filter?.hasEnrollments !== undefined) {
        where.enrollments = filter.hasEnrollments ? { some: {} } : { none: {} };
      }

      return await this.prisma.course.findMany({
        where,
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find all courses");
    }
  }

  async findById(id: string): Promise<Course | null> {
    try {
      return await this.prisma.course.findUnique({
        where: { id },
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find course by ID");
    }
  }

  async create(data: {
    title: string;
    description: string;
    level: CourseLevel;
  }): Promise<Course> {
    try {
      return await this.prisma.course.create({
        data,
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Create course");
    }
  }

  async update(id: string, data: UpdateCourseInput): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Update course");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Delete course");
    }
  }

  async getEnrollmentCount(courseId: string): Promise<number> {
    try {
      return await this.prisma.enrollment.count({
        where: { courseId },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Get enrollment count");
    }
  }

  async getProfessorCount(courseId: string): Promise<number> {
    try {
      return await this.prisma.enrollment.count({
        where: {
          courseId,
          role: "PROFESSOR",
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Get professor count");
    }
  }

  async getStudentCount(courseId: string): Promise<number> {
    try {
      return await this.prisma.enrollment.count({
        where: {
          courseId,
          role: "STUDENT",
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Get student count");
    }
  }
}
