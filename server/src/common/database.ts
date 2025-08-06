import { PrismaClient } from "@prisma/client";
import { config } from "./config";

class Database {
  private static instance: Database;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log:
        config.server.nodeEnv === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log("Database disconnected successfully");
    } catch (error) {
      console.error("Database disconnection failed:", error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }
}

export const database = Database.getInstance();
export default database;
