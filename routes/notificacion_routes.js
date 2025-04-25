import express from "express";
import {
	crearNotificacion,
	marcarComoLeida,
	obtenerNotificacionesPorUsuario,
} from "../controllers/NotificacionController.js";

const router = express.Router();

// Ruta para crear una notificación
router.post("/crear", crearNotificacion);

// Ruta para marcar una notificación como leída
router.put("/leida/:id", marcarComoLeida);

// Ruta para obtener todas las notificaciones de un usuario
router.get("/usuario/:id_usuario", obtenerNotificacionesPorUsuario);

export default router;
