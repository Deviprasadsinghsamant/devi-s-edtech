import { User } from "@prisma/client";
import { BaseDAO } from "./BaseDAO";

export class UserDAO extends BaseDAO<User> {
  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find all users");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find user by ID");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find user by email");
    }
  }

  async create(data: { name: string; email: string }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Create user");
    }
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string }>
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Update user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Delete user");
    }
  }
}
