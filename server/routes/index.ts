import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { logger } from "../utils/logger";
import { AnyZodObject, z } from "zod";
import { db } from "@db";
import { projects, comments } from "@db/schema";
import { eq } from "drizzle-orm";
import path from "path";

// Validation middleware
const validateRequest = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const message = error instanceof z.ZodError 
        ? "Validation failed" 
        : "Internal server error";

      logger.log(`Error: ${error}`, "error");
      res.status(error instanceof z.ZodError ? 400 : 500)
         .json({ message, errors: error instanceof z.ZodError ? error.errors : undefined });
    }
  };

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      logger.log(`Failed to fetch projects: ${error}`, "error");
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", validateRequest(z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
  })), async (req, res) => {
    try {
      const newProject = await db.insert(projects)
        .values(req.body)
        .returning();
      res.json(newProject[0]);
    } catch (error) {
      logger.log(`Project creation error: ${error}`, "error");
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Comment routes
  app.get("/api/comments/:projectId", async (req, res) => {
    try {
      const projectComments = await db.select()
        .from(comments)
        .where(eq(comments.projectId, parseInt(req.params.projectId)));
      res.json(projectComments);
    } catch (error) {
      logger.log(`Failed to fetch comments: ${error}`, "error");
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/projects/:projectId/comments", validateRequest(z.object({
    content: z.string().min(1).max(1000)
  })), async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const newComment = await db.insert(comments)
        .values({
          projectId,
          author: "Anonymous",
          content: req.body.content,
        })
        .returning();
      res.json(newComment[0]);
    } catch (error) {
      logger.log(`Failed to add comment: ${error}`, "error");
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Contact form route
  app.post("/api/contact", validateRequest(z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
  })), async (req, res) => {
    try {
      logger.log(`Contact form submission: ${JSON.stringify(req.body)}`);
      res.json({ message: "Message received successfully" });
    } catch (error) {
      logger.log(`Failed to process contact form: ${error}`, "error");
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // CV download route
  app.get("/api/download-cv", (req, res) => {
    try {
      const filePath = path.resolve("./client/public/CV_Imad_Bouzalmata.pdf");
      res.setHeader("Content-Type", "application/pdf")
         .setHeader("Content-Disposition", "attachment; filename=CV_Imad_Bouzalmata.pdf")
         .setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
         .sendFile(filePath);
    } catch (error) {
      logger.log(`Failed to download CV: ${error}`, "error");
      res.status(500).json({ message: "Failed to download CV" });
    }
  });

  return httpServer;
}