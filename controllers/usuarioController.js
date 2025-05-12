//modelos
import Usuario from "../models/Usuario.js";
import TokensVerificacion from "../models/Tokens_verificacion.js";
import TokenRestablecimientoPassword from "../models/Tokens_restablecimiento_password.js";
//librerias
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//funciones mías
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";
import { generarTokenVerificacion } from "../controllers/Tokens_verificacionController.js";
import { generarTokenRestablecer } from "../controllers/Tokens_restablecimiento_passwordController.js";

// Registro de usuario
export const registrarUsuario = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}
	console.log(req.body);
	const { nombre, apellido, correo, telefono, password, pais, genero } =
		req.body;

	try {
		// Verificar si el correo ya está registrado
		const usuarioExistente = await Usuario.findOne({ where: { correo } });
		if (usuarioExistente) {
			return res.status(400).json({ mensaje: "El correo ya está registrado" });
		}

		// Crear usuario en la base de datos
		const usuario = await Usuario.create({
			nombre,
			apellido,
			correo,
			telefono,
			password,
			id_ciudad: pais,
			genero,
		});

		// Generar el token de verificación y enviarlo por correo
		await generarTokenVerificacion(usuario);

		res.status(201).json({
			mensaje:
				"Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.",
		});
	} catch (error) {
		console.error("Error al registrar usuario:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};
export const registrarUsuarioSinConfirmacion = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	const { nombre, apellido, correo, telefono, password, pais, genero } =
		req.body;

	try {
		// Verificar si el correo ya está registrado
		const usuarioExistente = await Usuario.findOne({ where: { correo } });
		if (usuarioExistente) {
			return res.status(400).json({ mensaje: "El correo ya está registrado" });
		}

		// Crear usuario con estado 'confirmado'
		await Usuario.create({
			nombre,
			apellido,
			correo,
			telefono,
			password,
			id_ciudad: pais,
			genero,
			estado: "confirmado", // Aquí se establece el estado directamente
		});

		res.status(201).json({
			mensaje: "Usuario registrado correctamente.",
		});
	} catch (error) {
		console.error("Error al registrar usuario:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Confirmar cuenta
export const confirmarCuenta = async (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(400).json({ msg: "Token no proporcionado." });
	}

	try {
		// Buscar el token en la base de datos
		const tokenVerificacion = await TokensVerificacion.findOne({
			where: { token },
		});

		if (!tokenVerificacion) {
			return res.status(400).json({ msg: "Token inválido o no encontrado." });
		}

		// Verificar si el token ha expirado
		const fechaActual = new Date();
		if (fechaActual > tokenVerificacion.expira) {
			return res.status(400).json({ msg: "El token ha expirado." });
		}

		// Decodificar el token para obtener el id del usuario
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(400).json({ msg: "Token no válido." });
		}

		// Buscar el usuario usando el id extraído del token
		const usuario = await Usuario.findOne({
			where: { id_usuario: decoded.usuarioId },
		});

		if (!usuario) {
			return res.status(404).json({ msg: "Usuario no encontrado." });
		}

		// Actualizar el estado de la cuenta y eliminar el token
		await usuario.update({ estado: "confirmado" });

		// Eliminar el token de la base de datos para evitar que se reutilice
		await TokensVerificacion.destroy({ where: { token } });

		// Responder con éxito
		res.json({ msg: "Cuenta confirmada correctamente." });
	} catch (error) {
		console.error("Error al confirmar cuenta:", error);
		res.status(500).json({ msg: "Error en el servidor." });
	}
};

// Mostrar todos los usuarios
export const mostrarUsuarios = async (req, res) => {
	try {
		console.log("el user su sesion esta activa de momento: ", req.usuario);

		const usuarios = await Usuario.findAll({
			attributes: [
				"id_usuario",
				"nombre",
				"apellido",
				"correo",
				"telefono",
				"estado",
				"rol_id",
				"id_ciudad",
				"genero",
			],
		});

		res.json(usuarios);
		//console.log("sigo enviando:", usuarios);
	} catch (error) {
		console.error("Error al obtener los usuarios:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

// Mostrar un usuario específico por ID
export const mostrarUsuario = async (req, res) => {
	try {
		const { idUsuario } = req.params;
		const usuario = await Usuario.findByPk(idUsuario, {
			attributes: [
				"id_usuario",
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

// recuperar password
// recuperar password
export const recuperarpassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Verificar si el usuario existe
		const usuario = await Usuario.findOne({ where: { correo: email } });

		if (!usuario) {
			return res
				.status(404)
				.json({ msg: "No existe una cuenta con ese correo." });
		}

		// Eliminar cualquier token anterior (esto está bien para evitar tokens viejos)
		await TokenRestablecimientoPassword.destroy({
			where: { id_usuario: usuario.id_usuario },
		});

		// Generar un nuevo token JWT (válido por 1 hora)
		const token = await generarTokenRestablecer(usuario); // Obtiene el token generado

		// El token ya es enviado en la función generarTokenRestablecer, no es necesario duplicar el envío
		console.log("Revisa el correo, enviamos las instrucciones.");

		return res.json({ msg: "Se ha enviado un correo con las instrucciones." });
	} catch (error) {
		console.error("Error en recuperar contraseña:", error);
		return res.status(500).json({ msg: "Error interno del servidor." });
	}
};

// cambiarpassword
export const cambiarpassword = async (req, res) => {
	try {
		const { token, nuevaPassword } = req.body;

		if (!token) {
			console.log("token no proporcionado");
			return res.status(400).json({ error: "Token no proporcionado." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const tokenRecord = await TokenRestablecimientoPassword.findOne({
			where: { token, id_usuario: decoded.usuarioId },
		});

		if (!tokenRecord || tokenRecord.expira < new Date()) {
			console.log("token invalido o expirado");
			return res.status(400).json({ error: "Token inválido o expirado." });
		}

		const usuario = await Usuario.findByPk(decoded.usuarioId);

		if (!usuario) {
			console.log("usuario no encontrado");
			return res.status(404).json({ error: "Usuario no encontrado." });
		}

		const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

		usuario.password = hashedPassword;

		await usuario.save();

		await TokenRestablecimientoPassword.destroy({ where: { token } });
		console.log("se cambio la contraseña exitosamente");
		return res.json({ mensaje: "Contraseña cambiada exitosamente." });
	} catch (err) {
		console.error("Error al cambiar la contraseña:", err);
		return res.status(500).json({ error: "Ocurrió un error en el servidor." });
	}
};

// Actualizar un usuario por ID
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
		const usuario = await Usuario.findOne({ where: { correo } });

		if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
			return res
				.status(400)
				.json({ mensaje: "Correo o contraseña incorrectos" });
		}

		if (usuario.estado == "pendiente") {
			return res.status(400).json({
				mensaje: "Cuenta pendiente de verificación. Revisa tu correo.",
				verificado: false,
			});
		}

		// Generar token JWT
		const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({
			mensaje: "Inicio de sesión exitoso",
			token,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
		});
	} catch (error) {
		console.error("Error en el inicio de sesión:", error);
		res.status(500).json({ mensaje: "Ocurrió un error. Inténtalo más tarde." });
	}
};

export const login = async (req, res) => {
	const { correo, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ where: { correo } });

		if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
			return res
				.status(400)
				.json({ mensaje: "Correo o contraseña incorrectos" });
		}

		if (usuario.estado === "pendiente") {
			return res.status(400).json({
				mensaje: "Cuenta pendiente de verificación. Revisa tu correo.",
				verificado: false,
			});
		}

		// Mapeo de roles
		const nombreRoles = {
			2: "cultural",
			3: "academico",
			6: "administrador",
			7: "deportivo",
			8: "gastronomico",
		};

		// Token base
		const payload = {
			id: usuario.id_usuario,
		};

		// Si el usuario tiene un rol permitido, añade info adicional
		if (Object.keys(nombreRoles).includes(usuario.rol_id.toString())) {
			payload.rol_id = usuario.rol_id;
			payload.rol_nombre = nombreRoles[usuario.rol_id];
		}

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "12h",
		});

		res.json({
			mensaje: "Inicio de sesión exitoso",
			token,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
			idUsuario: usuario.id_usuario,
			rol: nombreRoles[usuario.rol_id] || null, // opcional en frontend
		});
	} catch (error) {
		console.error("Error en el inicio de sesión:", error);
		res.status(500).json({ mensaje: "Ocurrió un error. Inténtalo más tarde." });
	}
};

/**
 * ==========================================
 * SECCION DE ADMINISTRADORES
 * ==========================================
 */

export const loginAdministrador = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Buscar el usuario por correo
		const usuario = await Usuario.findOne({ where: { correo: email } });

		if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
			return res
				.status(400)
				.json({ mensaje: "Correo o contraseña incorrectos" });
		}

		// Verificar si la cuenta está pendiente de verificación
		if (usuario.estado === "pendiente") {
			return res.status(400).json({
				mensaje: "Cuenta pendiente de verificación. Revisa tu correo.",
				verificado: false,
			});
		}

		// Verificar si el rol es uno de los permitidos
		const rolesPermitidos = [2, 3, 6, 7, 8];

		// Mapeo de IDs a nombres de roles
		const nombreRoles = {
			2: "cultural",
			3: "academico",
			6: "administrador",
			7: "deportivo",
			8: "gastronomico",
		};

		if (!rolesPermitidos.includes(usuario.rol_id)) {
			return res.status(403).json({
				mensaje: "Acceso denegado. No tienes los permisos necesarios.",
			});
		}

		// Obtener el nombre del rol
		const nombreRol = nombreRoles[usuario.rol_id] || "desconocido";

		// Generar el token JWT con el nombre del rol
		const token = jwt.sign(
			{
				id: usuario.id_usuario,
				rol_id: usuario.rol_id,
				rol_nombre: nombreRol,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "12h",
			}
		);

		// Responder con el token y la información del usuario
		res.json({
			mensaje: "Inicio de sesión exitoso",
			token,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
			rol: nombreRol, // Puedes retornarlo también si lo necesitas en frontend
		});
	} catch (error) {
		console.error("Error en el inicio de sesión:", error);
		res.status(500).json({ mensaje: "Ocurrió un error. Inténtalo más tarde." });
	}
};

// Cambiar el rol de un usuario
export const cambiarRolUsuario = async (req, res) => {
	try {
		const { id_usuario } = req.body; // o req.body, según cómo lo envíes
		const { nuevoRolId } = req.body;

		// Validar que el usuario existe
		const usuario = await Usuario.findByPk(id_usuario);
		if (!usuario) {
			return res.status(404).json({ mensaje: "Usuario no encontrado" });
		}

		// Actualizar el rol
		usuario.rol_id = nuevoRolId;
		await usuario.save();

		res.status(200).json({ mensaje: "Rol actualizado correctamente", usuario });
	} catch (error) {
		console.error("Error al cambiar el rol del usuario:", error);
		res.status(500).json({ mensaje: "Error del servidor" });
	}
};
