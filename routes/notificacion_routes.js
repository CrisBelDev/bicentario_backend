import express from "express";
import {
	crearNotificacion,
	marcarComoLeida,
	obtenerNotificacionesPorUsuario,
	crearNotificacionesParaTodos,
	crearNotificacionConID,
} from "../controllers/NotificacionController.js";

const router = express.Router();

// Ruta para crear una notificación
router.post("/crear", crearNotificacion);
router.post("/crear-todos", crearNotificacionesParaTodos);
// Ruta para marcar una notificación como leída
router.put("/leida/:id", marcarComoLeida);
router.post("/crearid/:id", crearNotificacionConID);
// Ruta para obtener todas las notificaciones de un usuario
router.get("/usuario/:id_usuario", obtenerNotificacionesPorUsuario);

export default router;
