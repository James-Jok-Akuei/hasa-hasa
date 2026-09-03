import { buildApp } from "./app.js";
import { env } from "./lib/env.js";
import { prisma } from "./lib/prisma.js";

const app = await buildApp();

const shutdown = async (signal: string) => {
  app.log.info(`${signal} received, shutting down`);
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

try {
  // 0.0.0.0 so a phone on the same wifi can reach it - needed once the Expo
  // app lands, and handy for testing from a real handset now.
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (error) {
  // tsx watch is a supervisor: killing the child leaves the watcher to
  // respawn and grab the port again, so say how to clear it properly.
  if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `\n  Port ${env.PORT} is already in use.\n\n` +
        `    lsof -ti tcp:${env.PORT} | xargs kill -9\n` +
        `    pkill -f "tsx.*server.ts"\n\n` +
        `  Or run on another port:  PORT=4001 pnpm dev\n`,
    );
    process.exit(1);
  }
  app.log.error(error);
  process.exit(1);
}
