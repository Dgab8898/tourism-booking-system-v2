import "dotenv/config";

import type { Server } from "node:http";

import { app } from "./app.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";
import { env } from "./config/env.js";

let server: Server | undefined;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      console.log(
        `API server running on http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start the application.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  }
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down gracefully.`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      console.log("HTTP server closed.");
    }

    await disconnectDatabase();
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exitCode = 1;
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
