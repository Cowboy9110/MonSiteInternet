import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "@db";
import { sql } from "drizzle-orm";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ajout de CORS pour autoriser les requêtes cross-origin
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Ajout de Helmet pour renforcer les en-têtes de sécurité
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    dnsPrefetchControl: false,
    frameguard: false,
    hidePoweredBy: true,
    hsts: false,
    noSniff: false,
    referrerPolicy: false,
    xssFilter: true,
  })
);

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

function gracefulShutdown(server: any) {
  return new Promise((resolve) => {
    server.close(() => {
      logger.log("Server shutdown completed");
      resolve(true);
    });
  });
}

(async () => {
  try {
    logger.log("Starting server...");
    logger.log("Testing database connection...");

    // Test database connection with more detailed error logging
    try {
      await db.execute(sql`SELECT 1`);
      logger.log("Database connection established");

      // Ensure database schema is up-to-date
      logger.log("Ensure database schema is up-to-date...");
      // Drizzle Kit handles migrations via CLI command
    } catch (dbError) {
      logger.log(`Database initialization failed: ${dbError}`, "error");
      throw dbError;
    }

    logger.log("Setting up routes...");
    const server = registerRoutes(app);

    // Global error handler with more detailed logging
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      const errorInfo = {
        path: req.path,
        method: req.method,
        message: err.message,
        stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        status: err.status || err.statusCode || 500,
        type: err.constructor.name,
        timestamp: new Date().toISOString(),
      };

      logger.log(`Error: ${JSON.stringify(errorInfo)}`, "error");

      const status = errorInfo.status;
      const message =
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message || "Internal Server Error";

      res.status(status).json({
        message,
        code: status,
        requestId: req.headers["x-request-id"] || Date.now().toString(),
      });
    });

    if (app.get("env") === "development") {
      logger.log("Setting up Vite development server...");
      await setupVite(app, server);
    } else {
      logger.log("Setting up static file serving...");
      serveStatic(app);
    }

    // Use port 8080 for deployment compatibility
    const PORT = 8080;

    // Handle server shutdown gracefully
    process.on("SIGTERM", () => gracefulShutdown(server));
    process.on("SIGINT", () => gracefulShutdown(server));

    // Add error handler for the server
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        logger.log(`Port ${PORT} is already in use. Waiting for it to be available...`, "error");
        setTimeout(() => {
          server.close();
          server.listen(PORT, "0.0.0.0");
        }, 1000);
      } else {
        logger.log(`Server error: ${error}`, "error");
        throw error;
      }
    });

    server.listen(PORT, "0.0.0.0", () => {
      logger.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    logger.log(`Failed to start server: ${error}`, "error");
    process.exit(1);
  }
})();