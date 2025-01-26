import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { tasks } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  app.get("/api/tasks", async (_req, res) => {
    try {
      const allTasks = await db.select().from(tasks);
      res.json(allTasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      const [newTask] = await db
        .insert(tasks)
        .values({
          title,
          description,
          dueDate: new Date(dueDate),
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
      const { status } = req.body;
      const [updatedTask] = await db
        .update(tasks)
        .set({
          status,
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
