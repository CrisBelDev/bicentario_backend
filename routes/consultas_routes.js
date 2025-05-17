import express from "express";
import {
	eventosPorTipo,
	asistenciasPorEvento,
	eventosPorMes,
} from "../controllers/consultas.js";

const router = express.Router();
// Ruta para obtener eventos por tipo
router.get("/eventos-por-tipo", eventosPorTipo);
router.get("/asistencias-por-evento", asistenciasPorEvento);
router.get("/eventos-por-mes", eventosPorMes);
export default router;
