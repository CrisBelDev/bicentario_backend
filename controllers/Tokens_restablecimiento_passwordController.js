import TokenRestablecimientoPassword from "../models/Tokens_restablecimiento_password.js";
import jwt from "jsonwebtoken";
import { emailRecuperacion } from "../helpers/emails.js";

export const generarTokenRestablecer = async (usuario) => {
	try {
		// Verifica si el usuario ya tiene un token activo y elimínalo
		await TokenRestablecimientoPassword.destroy({
			where: { id_usuario: usuario.id_usuario },
		});

		// Generar un token JWT seguro
		const token = jwt.sign(
			{ usuarioId: usuario.id_usuario },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" } // Token expira en 1 hora
		);

		// Calcular la fecha de expiración del token
		const fechaExpiracion = new Date();
		fechaExpiracion.setHours(fechaExpiracion.getHours() + 1); // Expira en 1 hora

		// Guardar el token en la base de datos
		await TokenRestablecimientoPassword.create({
			token,
			id_usuario: usuario.id_usuario,
			expira: fechaExpiracion,
		});

		// Crear enlace de recuperación
		const enlace = `${process.env.FRONTEND_URL}/cambiarpassword/?token=${token}`;

		// Enviar correo con el enlace
		await emailRecuperacion({
			nombre: usuario.nombre,
			email: usuario.correo,
			token,
			enlace,
		});

		console.log("Token generado y enviado:", token);
		return token; // Aseguramos de devolver el token generado para ser utilizado en la función `recuperarpassword`
	} catch (error) {
		console.error("Error al generar el token de verificación:", error);
		throw new Error("No se pudo generar el token de recuperación.");
	}
};
