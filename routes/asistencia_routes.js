import express from "express";
import { registrarAsistencia } from "../controllers/AsistenciaController.js";

const router = express.Router();

// Ruta para crear una notificación
router.post("/registrar", registrarAsistencia);

export default router;
