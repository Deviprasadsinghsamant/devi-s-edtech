import { User } from "@prisma/client";
import { UserDAO } from "../daos/UserDAO";
import jwt from "jsonwebtoken";
import { config } from "../common/config";

interface AuthPayload {
  user: User;
  token: string;
  expiresAt: Date;
}

export class AuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

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

      // Generate mock JWT token
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
