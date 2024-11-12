import { Router } from "express";
import { getPuntosUser } from "../controllers/puntos.controller.js";

const router = Router();

router.get('/puntos/:identificacion', getPuntosUser);

export default router;