import express, { Router } from "express";
import { verificarToken } from "../middleware/verificarToken.js";
import {
	registrarUsuario,
	confirmarCuenta,
	mostrarUsuarios,
	mostrarUsuario,
	recuperarpassword,
	cambiarpassword,
	actualizarUsuario,
	eliminarUsuario,
	loginUsuario,
	loginAdministrador,
} from "../controllers/usuarioController.js";

//importando paiscontroller
import { mostrarPaises } from "../controllers/PaisController.js";
// importando ciudadcontroller
import { mostrarCiudades } from "../controllers/CiudadController.js";
import {
	crearEvento,
	mostrarEventos,
} from "../controllers/EventoController.js";

import upload from "../config/multerConfig.js";

const router = express.Router();

//agrega nuevos usuarios por post
router.post("/usuarios", registrarUsuario);
router.post("/confirmar", confirmarCuenta);
// Obtener todos los usuarios
router.get("/usuarios", mostrarUsuarios);
// Obtener usuario en especifico (ID)
router.get("/usuarios/:idUsuario", mostrarUsuario);
// recuperar contraseña
router.post("/recuperarpassword", recuperarpassword);
// cambiar password
router.post("/cambiarpassword", cambiarpassword);

// Actualizar usuario por su (ID)
router.put("/usuarios/:idUsuario", actualizarUsuario);
// Eliminar usuario por su (ID)
router.delete("/usuarios/:idUsuario", eliminarUsuario);

router.post("/login", loginUsuario);

/**
 * ==========================================
 * RUTAS PARA LA SECCION DE ADMINISTRADORES
 * ==========================================
 */
router.post("/admin/login", loginAdministrador);

/**
 * ==========================================
 * RUTAS PARA LA SECCION DE PAISES
 * ==========================================
 */
router.get("/pais", mostrarPaises);

/**
 * ==========================================
 * RUTAS PARA LA SECCION DE CIUDADES
 * ==========================================
 */

router.get("/ciudades/:id_pais", mostrarCiudades);

/**
 * ==========================================
 * RUTAS PARA LA SECCION DE EVENTOS
 * ==========================================
 */
router.post(
	"/evento/registrar",
	verificarToken, // Primero verificamos si el usuario está autenticado
	upload.single("imagenes"), // Luego procesamos la imagen
	crearEvento // Finalmente, creamos el evento
);
router.get("/evento/mostrar", mostrarEventos);

export default router;
