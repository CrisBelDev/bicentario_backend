import express from "express";

import {
	registrarUsuario,
	confirmarCuenta,
	mostrarUsuarios,
	mostrarUsuario,
	actualizarUsuario,
	eliminarUsuario,
	loginUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

//agrega nuevos usuarios por post
router.post("/usuarios", registrarUsuario);
router.post("/confirmar", confirmarCuenta);

// Obtener todos los usuarios
router.get("/usuarios", mostrarUsuarios);

// Obtener usuario en especifico (ID)
router.get("/usuarios/:idUsuario", mostrarUsuario);

// Actualizar usuario por su (ID)
router.put("/usuarios/:idUsuario", actualizarUsuario);

// Eliminar usuario por su (ID)
router.delete("/usuarios/:idUsuario", eliminarUsuario);

router.post("/login", loginUsuario);
export default router;
