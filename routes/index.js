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
	mostrarEventosPaginados,
	mostrarEventoPorId,
	eliminarEvento,
	editarEvento,
} from "../controllers/EventoController.js";

import { upload, upload1 } from "../config/multerConfig.js";

import EventoCulturalController, {
	subirImagenBlog,
} from "../controllers/Evento_culturalController.js";

//------------------------RUTAS------------------------------
const router = express.Router();

//agrega nuevos usuarios por post
router.post("/usuarios", registrarUsuario);
router.post("/confirmar", confirmarCuenta);

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
// Obtener todos los usuarios
router.get("/usuarios", verificarToken, mostrarUsuarios);
router.post(
	"/evento/registrar",
	verificarToken, // Primero verificamos si el usuario está autenticado
	upload.single("imagenes"), // Luego procesamos la imagen
	crearEvento // Finalmente, creamos el evento
);

router.get("/evento/detalle/:id", mostrarEventoPorId);

router.post("/upload-image", upload1.single("image"), subirImagenBlog);

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

router.get("/evento/mostrar", mostrarEventos);
router.get("/evento/mostrarPaginas", mostrarEventosPaginados);
router.delete("/evento/eliminar/:id_evento", eliminarEvento);
router.put(
	"/evento/editar/:id",
	verificarToken,
	upload.single("imagenes"),
	editarEvento
);

/**
 * ==========================================
 * RUTAS PARA LA SECCION DE EVENTOS CULTURAL
 * ==========================================
 */

// Obtener todos los eventos culturales
router.get("/evento-cultural", EventoCulturalController.getAll);

// Obtener un evento cultural por ID
router.get("/evento-cultural/:id", EventoCulturalController.getById);

// Crear un nuevo evento cultural
router.post(
	"/evento-cultural",

	EventoCulturalController.create
);

// Actualizar un evento cultural
router.put(
	"/evento-cultural/:id",
	verificarToken,
	EventoCulturalController.update
);

// Eliminar un evento cultural
router.delete(
	"/evento-cultural/:id",
	verificarToken,
	EventoCulturalController.delete
);

export default router;
