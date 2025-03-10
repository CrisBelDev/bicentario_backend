import Usuario from "../models/Usuario.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//funciones mias
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

// Registro de usuario
export const registrarUsuario = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	const { nombre, apellido, correo, password, telefono, pais, ciudad, genero } =
		req.body;

	try {
		const usuarioExistente = await Usuario.findOne({ where: { correo } });
		if (usuarioExistente) {
			return res.status(400).json({ mensaje: "El correo ya está registrado" });
		}
		//procedimiento para almacernar en la base de datos un usuario
		const usuario = await Usuario.create({
			nombre,
			apellido,
			correo,
			password,
			telefono,
			pais,
			ciudad,
			genero,
			token_verificacion: generarId(),
		});

		//envia email de confirmacion
		emailRegistro({
			nombre: usuario.nombre,
			email: usuario.correo,
			token: usuario.token_verificacion,
		});

		res.status(201).json({ mensaje: "Usuario registrado correctamente" });
	} catch (error) {
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

export const confirmarCuenta = async (req, res) => {
	const { token } = req.body;
	console.log("llego el token:", token);
	console.log("Token recibido en backend:", req.body.token);
	if (!token) {
		return res.status(400).json({ msg: "Token inválido o expirado." });
	}
	try {
		// Buscar el usuario por el token de validación
		const usuario = await Usuario.findOne({
			where: { token_verificacion: token },
		});

		if (!usuario) {
			return res.status(400).json({ msg: "Token inválido o expirado." });
		}

		// Actualizar el estado de la cuenta
		await usuario.update({ verificado: true, token_verificacion: null });

		res.json({ msg: "Cuenta confirmada correctamente." });
	} catch (error) {
		console.error(error); // Puedes agregar logs para depuración
		res.status(500).json({ msg: "Error en el servidor." });
	}
};
// Mostrar todos los usuarios
export const mostrarUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuario.findAll({
			attributes: [
				"id",
				"nombre",
				"apellido",
				"correo",
				"telefono",
				"pais",
				"ciudad",
				"genero",
				"verificado",
			],
		});
		res.json(usuarios);
	} catch (error) {
		console.error("Error al obtener los usuarios:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Mostrar usuario en especifico (ID)
export const mostrarUsuario = async (req, res) => {
	try {
		const { idUsuario } = req.params;
		const usuario = await Usuario.findByPk(idUsuario, {
			attributes: [
				"id",
				"nombre",
				"apellido",
				"correo",
				"telefono",
				"pais",
				"ciudad",
				"genero",
			],
		});

		if (!usuario) {
			return res.status(404).json({ mensaje: "Usuario no encontrado" });
		}

		res.json(usuario);
	} catch (error) {
		console.error("Error al obtener usuario:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Actualiza un usuario por su ID
export const actualizarUsuario = async (req, res) => {
	try {
		const { idUsuario } = req.params;
		const { nombre, apellido, correo, telefono, pais, ciudad, genero } =
			req.body;

		const usuario = await Usuario.findByPk(idUsuario);
		if (!usuario) {
			return res.status(404).json({ mensaje: "Usuario no encontrado" });
		}

		// Actualizar los campos proporcionados
		await usuario.update({
			nombre,
			apellido,
			correo,
			telefono,
			pais,
			ciudad,
			genero,
		});

		res.json({ mensaje: "Usuario actualizado correctamente" });
	} catch (error) {
		console.error("❌ Error al actualizar usuario:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Eliminar usuario por su ID
export const eliminarUsuario = async (req, res) => {
	try {
		const { idUsuario } = req.params;

		const usuario = await Usuario.findByPk(idUsuario);
		if (!usuario) {
			return res.status(404).json({ mensaje: "Usuario no encontrado" });
		}

		await usuario.destroy();
		res.json({ mensaje: "Usuario eliminado correctamente" });
	} catch (error) {
		console.error("Error al eliminar usuario:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Inicio de sesión
export const loginUsuario = async (req, res) => {
	const { correo, password } = req.body;

	try {
		// Buscar usuario
		const usuario = await Usuario.findOne({ where: { correo } });

		// Mensaje de error genérico para evitar revelar información sensible
		const mensajeError = "Correo o contraseña incorrectos";

		// Verificar si el usuario existe y la contraseña es válida
		if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
			return res.status(400).json({ mensaje: mensajeError });
		}

		// Verificar si la cuenta está confirmada
		if (usuario.token_verificacion !== null) {
			return res.status(400).json({
				mensaje: "Cuenta pendiente de verificación. Revisa tu correo.",
				verificado: false,
			});
		}

		// Generar token JWT
		const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Enviar la respuesta con datos mínimos
		res.json({
			mensaje: "Inicio de sesión exitoso",
			token,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Ocurrió un error. Inténtalo más tarde." });
	}
};
