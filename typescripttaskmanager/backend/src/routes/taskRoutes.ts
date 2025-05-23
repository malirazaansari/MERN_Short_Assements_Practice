import express from "express";
import Task from "../models/Task";

const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
  const { title } = req.body;
  const newTask = new Task({ title });
  await newTask.save();
  res.status(201).json(newTask);
});

// Get tasks with optional status filter
router.get("/", async (req, res) => {
  const status = req.query.status;
  const query =
    status === "completed"
      ? { completed: true }
      : status === "pending"
      ? { completed: false }
      : {};
  const tasks = await Task.find(query);
  res.json(tasks);
});

// Update task as completed
router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );
  res.json(task);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
