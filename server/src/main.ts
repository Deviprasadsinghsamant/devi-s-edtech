import "dotenv/config";
import { startServer } from "./server";

// Start the server
startServer().catch((error) => {
  console.error("Application failed to start:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
