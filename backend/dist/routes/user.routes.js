import { Router } from "express";
import { validateData } from "../middleware/validation.middleware.js";
import { registerUserSchema } from "../schema/user.schema";
import { registerUser } from "../controllers/user.controller";
const router = Router();
router.post("/register", validateData(registerUserSchema), registerUser);
export default router;
