import "dotenv/config";
import { createServer } from "../src/server";
import { database } from "../src/common/database";

let app: any = null;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      await database.connect();
      console.log("Database connection established");

      const serverInstance = await createServer();
      app = serverInstance.app;
    }

    return new Promise((resolve, reject) => {
      app(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
