import express from "express";
import {
	crearEventoAcademico,
	obtenerEventoAcademico,
	actualizarEventoAcademico,
	eliminarEventoAcademico,
} from "../controllers/Evento_academicoController.js";

const router = express.Router();

// Crear un evento académico
router.post("/", crearEventoAcademico);

// Obtener un evento académico por ID del evento base
router.get("/:id_evento", obtenerEventoAcademico);

// Actualizar un evento académico
router.put("/:id_evento", actualizarEventoAcademico);

// Eliminar un evento académico
router.delete("/:id_evento", eliminarEventoAcademico);

export default router;
