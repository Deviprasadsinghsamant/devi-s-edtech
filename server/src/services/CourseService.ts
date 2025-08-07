import { Course, CourseLevel } from "@prisma/client";
import { CourseDAO } from "../daos/CourseDAO";
import { EnrollmentDAO } from "../daos/EnrollmentDAO";

interface CourseFilter {
  level?: CourseLevel;
  hasEnrollments?: boolean;
}

interface UpdateCourseInput {
  title?: string;
  description?: string;
  level?: CourseLevel;
}

export class CourseService {
  private courseDAO: CourseDAO;
  private enrollmentDAO: EnrollmentDAO;

  constructor() {
    this.courseDAO = new CourseDAO();
    this.enrollmentDAO = new EnrollmentDAO();
  }

  async getAllCourses(filter?: CourseFilter): Promise<Course[]> {
    try {
      return await this.courseDAO.findAll(filter);
    } catch (error) {
      console.error("Get all courses error:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  async getCourseById(id: string): Promise<Course | null> {
    try {
      return await this.courseDAO.findById(id);
    } catch (error) {
      console.error("Get course by ID error:", error);
      throw new Error("Failed to fetch course");
    }
  }

  async createCourse(data: {
    title: string;
    description: string;
    level: CourseLevel;
  }): Promise<Course> {
    try {
      return await this.courseDAO.create(data);
    } catch (error) {
      console.error("Create course error:", error);
      throw new Error("Failed to create course");
    }
  }

  async updateCourse(
    id: string,
    data: UpdateCourseInput,
    userId?: string
  ): Promise<Course> {
    try {
      const existingCourse = await this.courseDAO.findById(id);
      if (!existingCourse) {
        throw new Error("Course not found");
      }

      if (userId) {
        const isProfessor = await this.enrollmentDAO.checkUserRole(
          userId,
          id,
          "PROFESSOR"
        );
        if (!isProfessor) {
          throw new Error("Only professors can edit courses");
        }
      }

      return await this.courseDAO.update(id, data);
    } catch (error) {
      console.error("Update course error:", error);
      throw error;
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const existingCourse = await this.courseDAO.findById(id);
      if (!existingCourse) {
        throw new Error("Course not found");
      }

      await this.courseDAO.delete(id);
    } catch (error) {
      console.error("Delete course error:", error);
      throw error;
    }
  }

  async getCourseCount(): Promise<number> {
    try {
      const courses = await this.courseDAO.findAll();
      return courses.length;
    } catch (error) {
      console.error("Get course count error:", error);
      throw new Error("Failed to count courses");
    }
  }

  async getCourseStats(courseId: string) {
    try {
      const [enrollmentCount, professorCount, studentCount] = await Promise.all(
        [
          this.courseDAO.getEnrollmentCount(courseId),
          this.courseDAO.getProfessorCount(courseId),
          this.courseDAO.getStudentCount(courseId),
        ]
      );

      return {
        enrollmentCount,
        professorCount,
        studentCount,
      };
    } catch (error) {
      console.error("Get course stats error:", error);
      throw new Error("Failed to fetch course statistics");
    }
  }

  async validateProfessorAccess(
    courseId: string,
    userId: string
  ): Promise<boolean> {
    try {
      return await this.enrollmentDAO.checkUserRole(
        userId,
        courseId,
        "PROFESSOR"
      );
    } catch (error) {
      console.error("Validate professor access error:", error);
      return false;
    }
  }
}
