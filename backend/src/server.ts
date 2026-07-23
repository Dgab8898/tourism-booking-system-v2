import "dotenv/config";

import { app } from "./app.js";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully.`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
