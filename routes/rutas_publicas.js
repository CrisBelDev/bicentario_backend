import express from "express";
import { obtenerEventosPorNombre } from "../controllers/consultas.js";

const router = express.Router();

router.get("/:id", obtenerEventoGastronomico);
router.post("/", crearEventoGastronomico);
router.put("/:id", actualizarEventoGastronomico);
router.delete("/:id", eliminarEventoGastronomico);

export default router;
