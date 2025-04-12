import express from "express";
import {
	obtenerEventoGastronomico,
	crearEventoGastronomico,
	actualizarEventoGastronomico,
	eliminarEventoGastronomico,
} from "../controllers/Evento_gastronomicoController.js";

const router = express.Router();

router.get("/:id", obtenerEventoGastronomico);
router.post("/", crearEventoGastronomico);
router.put("/:id", actualizarEventoGastronomico);
router.delete("/:id", eliminarEventoGastronomico);

export default router;
