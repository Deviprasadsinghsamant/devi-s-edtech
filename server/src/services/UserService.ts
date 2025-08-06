import { User } from "@prisma/client";
import { UserDAO } from "../daos/UserDAO";

export class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userDAO.findAll();
    } catch (error) {
      console.error("Get all users error:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userDAO.findById(id);
    } catch (error) {
      console.error("Get user by ID error:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userDAO.findByEmail(email);
    } catch (error) {
      console.error("Get user by email error:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(data: { name: string; email: string }): Promise<User> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userDAO.findByEmail(data.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      return await this.userDAO.create(data);
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    data: Partial<{ name: string; email: string }>
  ): Promise<User> {
    try {
      const existingUser = await this.userDAO.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Check if email is being updated and if it's already taken
      if (data.email && data.email !== existingUser.email) {
        const userWithEmail = await this.userDAO.findByEmail(data.email);
        if (userWithEmail) {
          throw new Error("Email already in use");
        }
      }

      return await this.userDAO.update(id, data);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const existingUser = await this.userDAO.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      await this.userDAO.delete(id);
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const users = await this.userDAO.findAll();
      return users.length;
    } catch (error) {
      console.error("Get user count error:", error);
      throw new Error("Failed to count users");
    }
  }
}
