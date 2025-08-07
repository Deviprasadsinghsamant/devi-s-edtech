import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/schema";
import { config } from "./common/config";
import { database } from "./common/database";
import { globalErrorHandler } from "./common/lib/errorHandler";

export async function createServer() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Devi's EdTech API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        graphql: "/graphql",
      },
      documentation: "GraphQL endpoint available at /graphql",
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "Devi's EdTech API is running",
      timestamp: new Date().toISOString(),
    });
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      let user = null;

      if (token) {
        try {
          const { AuthService } = await import("./services/AuthService");
          const authService = new AuthService();
          user = await authService.validateToken(token);
        } catch (error) {
          console.error("Token validation error:", error);
        }
      }

      return {
        req,
        user,
      };
    },
    introspection: config.server.nodeEnv === "development",
    debug: config.server.nodeEnv === "development",
  });

  await server.start();
  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
    cors: false,
  });

  app.use(globalErrorHandler);

  return { app, server };
}

export async function startServer() {
  try {
    await database.connect();
    console.log("Database connection established");

    const { app } = await createServer();

    const PORT = config.server.port;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(
        `GraphQL playground available at http://localhost:${PORT}/graphql`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
