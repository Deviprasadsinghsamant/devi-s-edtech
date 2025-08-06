import { PrismaClient } from "@prisma/client";
import { database } from "../common/database";

export abstract class BaseDAO<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = database.prisma;
  }

  abstract findAll(filter?: any): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: any): Promise<T>;
  abstract update(id: string, data: any): Promise<T>;
  abstract delete(id: string): Promise<void>;

  protected async handleDAOError(
    error: Error,
    operation: string
  ): Promise<never> {
    console.error(`DAO Error in ${operation}:`, error);
    throw error;
  }
}
