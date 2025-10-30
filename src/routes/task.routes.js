import { Router } from "express";
import { createTask, updatedAtTask, deleteTask, getTask, getAllTasks } from "../controllers/task.controllers.js";
import verifyjwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyjwt, createTask);
router.route("/update/:id").put(verifyjwt, updatedAtTask); // Changed to PUT
router.route("/delete/:id").delete(verifyjwt, deleteTask);  
router.route("/get-task/:id").get(verifyjwt, getTask);
router.route("/get-all").get(verifyjwt, getAllTasks); // New endpoint

export default router;