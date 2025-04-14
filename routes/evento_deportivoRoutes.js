import express from "express";
import {
	crearEventoDeportivo,
	obtenerEventoDeportivo,
	actualizarEventoDeportivo,
	eliminarEventoDeportivo,
} from "../controllers/Evento_deportivoController.js";

const router = express.Router();

router.post("/", crearEventoDeportivo);
router.get("/:id", obtenerEventoDeportivo);
router.put("/:id", actualizarEventoDeportivo);
router.delete("/:id", eliminarEventoDeportivo);

export default router;
