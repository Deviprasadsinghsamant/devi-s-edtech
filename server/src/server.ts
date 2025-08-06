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

  // Security middleware
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

  // CORS middleware
  app.use(
    cors({
      origin: config.server.corsOrigin,
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "Devi's EdTech API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Extract user from token if needed
      const token = req.headers.authorization?.replace("Bearer ", "");

      return {
        req,
        user: null, // TODO: Implement JWT validation if needed
      };
    },
    introspection: config.server.nodeEnv === "development",
    debug: config.server.nodeEnv === "development",
  });

  await server.start();
  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
    cors: false, // We handle CORS above
  });

  // Global error handler (should be last)
  app.use(globalErrorHandler);

  return { app, server };
}

export async function startServer() {
  try {
    // Connect to database
    await database.connect();
    console.log("Database connection established");

    // Create and start server
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
