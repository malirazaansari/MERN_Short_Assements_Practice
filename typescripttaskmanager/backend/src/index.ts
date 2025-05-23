import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/taskdb")
  .then(() => console.log("MongoDB connected"));

app.use("/tasks", taskRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
