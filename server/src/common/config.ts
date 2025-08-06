import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
  database: {
    url: string;
    user: string;
    password: string;
    name: string;
    port: number;
  };
  server: {
    port: number;
    nodeEnv: string;
    corsOrigin: string;
  };
  auth: {
    jwtSecret: string;
  };
}

export const config: Config = {
  database: {
    url: process.env.DATABASE_URL || "",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "nextcaredb",
    port: parseInt(process.env.DB_PORT || "5432"),
  },
  server: {
    port: parseInt(process.env.PORT || "4000"),
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "default-secret",
  },
};

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
