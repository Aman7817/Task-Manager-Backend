import { Router } from "express";
import { triggerSync, getSyncStatus } from "../controllers/sync.controllers.js";
import verifyjwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/trigger").post(verifyjwt, triggerSync);
router.route("/status").get(verifyjwt, getSyncStatus);

export default router;