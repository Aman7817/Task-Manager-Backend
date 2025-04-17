import { Router } from "express";
import { createTask, updatedAtTask,deleteTask,getTask } from "../controllers/task.controllers.js";
import verifyjwt from "../middlewares/auth.middleware.js";
const router = Router();



router.route("/create").post(verifyjwt,createTask)

router.route("/update/:id").post(verifyjwt, updatedAtTask)

router.route("/delete/:id").delete(verifyjwt,deleteTask)  

router.route("/get-task/:id").get(verifyjwt, getTask)



export default router