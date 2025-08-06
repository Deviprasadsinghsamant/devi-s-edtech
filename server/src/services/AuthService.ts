import { User } from "@prisma/client";
import { UserDAO } from "../daos/UserDAO";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../common/config";

interface AuthPayload {
  user: User;
  token: string;
  expiresAt: Date;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async register(input: RegisterInput): Promise<AuthPayload> {
    try {
      // Check if user already exists
      const existingUser = await this.userDAO.findByEmail(input.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create new user
      const user = await this.userDAO.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        config.auth.jwtSecret,
        { expiresIn: "7d" }
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      return {
        user,
        token,
        expiresAt,
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    try {
      // Find user by email
      const user = await this.userDAO.findByEmail(input.email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(input.password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        config.auth.jwtSecret,
        { expiresIn: "7d" }
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      return {
        user,
        token,
        expiresAt,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Keep the mock login for backward compatibility during transition
  async mockLogin(email: string): Promise<AuthPayload> {
    try {
      // Find or create user with this email
      let user = await this.userDAO.findByEmail(email);

      if (!user) {
        // Create a new user if doesn't exist
        const name = email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        user = await this.userDAO.create({
          name,
          email,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        config.auth.jwtSecret,
        { expiresIn: "7d" }
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      return {
        user,
        token,
        expiresAt,
      };
    } catch (error) {
      console.error("Mock login error:", error);
      throw new Error("Login failed");
    }
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
      const user = await this.userDAO.findById(decoded.userId);
      return user;
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      return await this.userDAO.findById(userId);
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }
}
