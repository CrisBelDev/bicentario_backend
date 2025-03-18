import TokensVerificacion from "../models/Tokens_verificacion.js";
import jwt from "jsonwebtoken";
import { emailRegistro } from "../helpers/emails.js";

// Función para crear y guardar el token
export const generarTokenVerificacion = async (usuario) => {
	try {
		// Generar un token JWT
		const token = jwt.sign(
			{ usuarioId: usuario.id_usuario },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" } // Esto genera el token con 1 día de expiración
		);

		// Calcular la fecha de expiración del token
		const fechaExpiracion = new Date();
		fechaExpiracion.setDate(fechaExpiracion.getDate() + 1); // Sumar 1 día

		// Imprimir la fecha y la zona horaria
		console.log("El token:", token);
		console.log("Fecha de expiración:", fechaExpiracion);
		console.log("Fecha con zona horaria:", fechaExpiracion.toString()); // Muestra la fecha con la zona horaria
		console.log("Offset UTC:", fechaExpiracion.getTimezoneOffset()); // Muestra el desfase con UTC en minutos

		// Crear el registro de token de verificación
		await TokensVerificacion.create({
			token,
			id_usuario: usuario.id_usuario,
			expira: fechaExpiracion, // Guardar la fecha de expiración en el campo 'expira'
		});

		// Enviar el token por correo electrónico
		emailRegistro({
			nombre: usuario.nombre,
			email: usuario.correo,
			token,
		});

		return token;
	} catch (error) {
		console.error("Error al generar el token de verificación:", error);
		throw new Error("No se pudo generar el token de verificación.");
	}
};
