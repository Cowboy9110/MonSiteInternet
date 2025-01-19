import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { logger } from "./utils/logger";
import { AnyZodObject, z } from "zod";
import { db } from "@db";
import { projects, comments } from "@db/schema";
import { eq } from "drizzle-orm";
import path from "path";

function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.log(`Validation error: ${JSON.stringify(error.errors)}`, "error");
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        logger.log(`Unexpected error during validation: ${error}`, "error");
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
}

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Get all projects
  app.get("/api/projects", async (_req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      logger.log(`Failed to fetch projects: ${error}`, "error");
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Add new project
  app.post("/api/projects", async (req, res) => {
    try {
      const schema = z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
      });

      const projectData = schema.parse(req.body);
      const newProject = await db.insert(projects).values(projectData).returning();

      res.json(newProject[0]);
    } catch (error) {
      logger.log(`Project creation error: ${error}`, "error");
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Get comments for a project
  app.get("/api/comments/:projectId", async (req, res) => {
    try {
      const projectComments = await db
        .select()
        .from(comments)
        .where(eq(comments.projectId, parseInt(req.params.projectId)));
      res.json(projectComments);
    } catch (error) {
      logger.log(`Failed to fetch comments: ${error}`, "error");
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Add a comment
  app.post("/api/projects/:projectId/comments", async (req, res) => {
    try {
      const schema = z.object({
        content: z.string().min(1).max(1000)
      });

      const { content } = schema.parse(req.body);
      const projectId = z.number().int().positive().parse(parseInt(req.params.projectId));

      const newComment = await db
        .insert(comments)
        .values({
          projectId,
          author: "Anonymous",
          content,
        })
        .returning();

      res.json(newComment[0]);
    } catch (error) {
      logger.log(`Failed to add comment: ${error}`, "error");
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Contact form - simple version without email
  app.post("/api/contact", async (req, res) => {
    try {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        message: z.string(),
      });

      const data = schema.parse(req.body);

      // For now, just log the contact form submission
      logger.log(`Contact form submission: ${JSON.stringify(data)}`);

      res.json({ message: "Message received successfully" });
    } catch (error) {
      logger.log(`Failed to process contact form: ${error}`, "error");
      res.status(500).json({ 
        message: error instanceof z.ZodError 
          ? "Invalid form data" 
          : "Failed to process message"
      });
    }
  });

  // Secure CV download endpoint
  app.get("/api/download-cv", (req, res) => {
    try {
      const filePath = path.resolve("./client/public/CV_Imad_Bouzalmata.pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=CV_Imad_Bouzalmata.pdf");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(filePath);
    } catch (error) {
      logger.log(`Failed to download CV: ${error}`, "error");
      res.status(500).json({ message: "Failed to download CV" });
    }
  });

  return httpServer;
}
