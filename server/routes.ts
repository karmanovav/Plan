import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tasks, categories } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Categories API
  app.get("/api/categories", async (_req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const { name } = req.body;
      const [newCategory] = await db
        .insert(categories)
        .values({ name })
        .returning();
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Tasks API
  app.get("/api/tasks", async (_req, res) => {
    try {
      const allTasks = await db
        .select({
          ...tasks,
          categoryName: categories.name,
        })
        .from(tasks)
        .leftJoin(categories, eq(tasks.categoryId, categories.id));
      res.json(allTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const { title, description, dueDate, categoryId } = req.body;
      const [newTask] = await db
        .insert(tasks)
        .values({
          title,
          description,
          dueDate: new Date(dueDate),
          categoryId,
          status: "created",
        })
        .returning();
      res.json(newTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, title, description, dueDate, categoryId } = req.body;
      const [updatedTask] = await db
        .update(tasks)
        .set({
          ...(status && { status }),
          ...(title && { title }),
          ...(description && { description }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(categoryId && { categoryId }),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, parseInt(id)))
        .returning();
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}