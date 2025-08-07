import { Enrollment, UserRole } from "@prisma/client";
import { EnrollmentDAO } from "../daos/EnrollmentDAO";
import { UserDAO } from "../daos/UserDAO";
import { CourseDAO } from "../daos/CourseDAO";

interface EnrollmentInput {
  userId: string;
  courseId: string;
  role: UserRole;
}

export class EnrollmentService {
  private enrollmentDAO: EnrollmentDAO;
  private userDAO: UserDAO;
  private courseDAO: CourseDAO;

  constructor() {
    this.enrollmentDAO = new EnrollmentDAO();
    this.userDAO = new UserDAO();
    this.courseDAO = new CourseDAO();
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    try {
      return await this.enrollmentDAO.findAll();
    } catch (error) {
      console.error("Get all enrollments error:", error);
      throw new Error("Failed to fetch enrollments");
    }
  }

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    try {
      return await this.enrollmentDAO.findById(id);
    } catch (error) {
      console.error("Get enrollment by ID error:", error);
      throw new Error("Failed to fetch enrollment");
    }
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      const user = await this.userDAO.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return await this.enrollmentDAO.findByUserId(userId);
    } catch (error) {
      console.error("Get user enrollments error:", error);
      throw error;
    }
  }

  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    try {
      const course = await this.courseDAO.findById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      return await this.enrollmentDAO.findByCourseId(courseId);
    } catch (error) {
      console.error("Get course enrollments error:", error);
      throw error;
    }
  }

  async enrollUser(data: EnrollmentInput): Promise<Enrollment> {
    try {
      const user = await this.userDAO.findById(data.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const course = await this.courseDAO.findById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      const existingEnrollment = await this.enrollmentDAO.findByUserAndCourse(
        data.userId,
        data.courseId
      );

      if (existingEnrollment) {
        throw new Error("User is already enrolled in this course");
      }

      return await this.enrollmentDAO.create(data);
    } catch (error) {
      console.error("Enroll user error:", error);
      throw error;
    }
  }

  async unenrollUser(userId: string, courseId: string): Promise<boolean> {
    try {
      const existingEnrollment = await this.enrollmentDAO.findByUserAndCourse(
        userId,
        courseId
      );
      if (!existingEnrollment) {
        throw new Error("Enrollment not found");
      }

      await this.enrollmentDAO.deleteByUserAndCourse(userId, courseId);
      return true;
    } catch (error) {
      console.error("Unenroll user error:", error);
      throw error;
    }
  }

  async updateEnrollmentRole(id: string, role: UserRole): Promise<Enrollment> {
    try {
      const existingEnrollment = await this.enrollmentDAO.findById(id);
      if (!existingEnrollment) {
        throw new Error("Enrollment not found");
      }

      return await this.enrollmentDAO.update(id, { role });
    } catch (error) {
      console.error("Update enrollment role error:", error);
      throw error;
    }
  }

  async checkUserEnrollment(
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    try {
      return await this.enrollmentDAO.findByUserAndCourse(userId, courseId);
    } catch (error) {
      console.error("Check user enrollment error:", error);
      return null;
    }
  }

  async checkUserRole(
    userId: string,
    courseId: string,
    role: UserRole
  ): Promise<boolean> {
    try {
      return await this.enrollmentDAO.checkUserRole(userId, courseId, role);
    } catch (error) {
      console.error("Check user role error:", error);
      return false;
    }
  }

  async isUserProfessor(userId: string, courseId: string): Promise<boolean> {
    return this.checkUserRole(userId, courseId, UserRole.PROFESSOR);
  }

  async isUserStudent(userId: string, courseId: string): Promise<boolean> {
    return this.checkUserRole(userId, courseId, UserRole.STUDENT);
  }
}
